import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { Loan } from '../loans/entities/loan.entity';
import { ReadingActivity } from '../reading-activities/entities/reading-activity.entity';
import { PointsTransaction } from '../points/entities/points-transaction.entity';
import { Book } from '../books/entities/book.entity';
import { BookCopy } from '../books/entities/book-copy.entity';

@Injectable()
export class MlPredictionsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(ReadingActivity)
    private readonly activityRepository: Repository<ReadingActivity>,
    @InjectRepository(PointsTransaction)
    private readonly pointsRepository: Repository<PointsTransaction>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookCopy)
    private readonly copyRepository: Repository<BookCopy>,
  ) {}

  /**
   * Predict a student's reading engagement risk level based on activity history.
   * Uses a simple weighted scoring heuristic (not a trained ML model, but a
   * transparent rule-based predictor that can later be swapped for a real model).
   */
  async predictStudentRisk(studentId: number) {
    const student = await this.studentRepository.findOne({ where: { id: studentId } });
    if (!student) throw new Error(`Student #${studentId} not found`);

    const loans = await this.loanRepository.count({ where: { studentId } });
    const activities = await this.activityRepository.count({ where: { studentId } });
    const approvedActivities = await this.activityRepository.count({ where: { studentId, status: 'approved' } });
    const points = student.totalPoints;

    // Engagement score: weighted combination
    const engagementScore = (loans * 10) + (approvedActivities * 15) + (points * 0.5);

    let riskLevel: string;
    let recommendation: string;
    if (engagementScore < 20) {
      riskLevel = 'high';
      recommendation = 'Student shows low engagement. Consider outreach and reading encouragement.';
    } else if (engagementScore < 50) {
      riskLevel = 'medium';
      recommendation = 'Moderate engagement. Monitor progress and suggest targeted reading challenges.';
    } else {
      riskLevel = 'low';
      recommendation = 'Student is highly engaged. Consider advanced reading challenges.';
    }

    return {
      studentId,
      studentName: student.fullName,
      metrics: { loans, activities, approvedActivities, points },
      engagementScore: Math.round(engagementScore),
      riskLevel,
      recommendation,
    };
  }

  /**
   * Recommend books for a student based on their reading history and category preferences.
   */
  async recommendBooks(studentId: number, limit = 5) {
    // Find the student's most-read categories from loan history
    const loans = await this.loanRepository.find({
      where: { studentId },
      relations: ['copy', 'copy.book', 'copy.book.category'],
    });

    const categoryScores = new Map<number, number>();
    for (const loan of loans) {
      const catId = loan.copy?.book?.categoryId;
      if (catId) categoryScores.set(catId, (categoryScores.get(catId) ?? 0) + 1);
    }

    const sortedCategories = [...categoryScores.entries()].sort((a, b) => b[1] - a[1]);

    if (sortedCategories.length === 0) {
      // No history yet - recommend most borrowed books overall
      const popularCopies = await this.copyRepository
        .createQueryBuilder('copy')
        .leftJoinAndSelect('copy.book', 'book')
        .leftJoinAndSelect('book.category', 'category')
        .where('copy.status = :status', { status: 'available' })
        .take(limit)
        .getMany();
      return popularCopies.map((c) => c.book).filter(Boolean);
    }

    // Recommend available books from the student's favorite categories
    const topCategoryId = sortedCategories[0][0];
    const alreadyReadBookIds = new Set(loans.map((l) => l.copy?.bookId).filter(Boolean));

    const books = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.copies', 'copy')
      .where('book.categoryId = :catId', { catId: topCategoryId })
      .andWhere('book.isArchived = false')
      .getMany();

    const recommendations = books
      .filter((b) => !alreadyReadBookIds.has(b.id))
      .filter((b) => b.copies?.some((c) => c.status === 'available'))
      .slice(0, limit);

    return recommendations;
  }

  /**
   * Predict overall library health metrics.
   */
  async getLibraryHealth() {
    const totalStudents = await this.studentRepository.count();
    const totalBooks = await this.bookRepository.count();
    const totalCopies = await this.copyRepository.count();
    const activeLoans = await this.loanRepository.count({ where: { returnDate: undefined as any } });

    const overdueLoans = await this.loanRepository
      .createQueryBuilder('loan')
      .where('loan.returnDate IS NULL')
      .andWhere('loan.dueDate < :now', { now: new Date() })
      .getCount();

    const totalActivities = await this.activityRepository.count();
    const pendingActivities = await this.activityRepository.count({ where: { status: 'pending' } });

    const utilizationRate = totalCopies > 0 ? ((activeLoans / totalCopies) * 100).toFixed(1) : '0';
    const overdueRate = activeLoans > 0 ? ((overdueLoans / activeLoans) * 100).toFixed(1) : '0';

    return {
      totalStudents,
      totalBooks,
      totalCopies,
      activeLoans,
      overdueLoans,
      totalActivities,
      pendingActivities,
      utilizationRate: `${utilizationRate}%`,
      overdueRate: `${overdueRate}%`,
    };
  }
}
