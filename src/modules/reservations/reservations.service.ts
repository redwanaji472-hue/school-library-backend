import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Book } from '../books/entities/book.entity';
import { BookCopy } from '../books/entities/book-copy.entity';
import { Student } from '../students/entities/student.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookCopy)
    private readonly copyRepository: Repository<BookCopy>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  findAll() {
    return this.reservationRepository.find({ relations: ['book', 'student'] });
  }

  async findOne(id: number) {
    const reservation = await this.reservationRepository.findOne({ where: { id }, relations: ['book', 'student'] });
    if (!reservation) throw new NotFoundException(`Reservation #${id} not found`);
    return reservation;
  }

  async create(dto: CreateReservationDto) {
    const book = await this.bookRepository.findOne({ where: { id: dto.bookId } });
    if (!book) throw new NotFoundException(`Book #${dto.bookId} not found`);

    const student = await this.studentRepository.findOne({ where: { id: dto.studentId } });
    if (!student) throw new NotFoundException(`Student #${dto.studentId} not found`);

    // Check if there are any available copies
    const availableCopy = await this.copyRepository.findOne({ where: { bookId: dto.bookId, status: 'available' } });
    if (availableCopy) throw new BadRequestException('Book has available copies, no need to reserve');

    // Check if student already has a pending reservation for this book
    const existing = await this.reservationRepository.findOne({ where: { bookId: dto.bookId, studentId: dto.studentId, status: 'pending' } });
    if (existing) throw new BadRequestException('Student already has a pending reservation for this book');

    const reservation = this.reservationRepository.create({
      bookId: dto.bookId,
      studentId: dto.studentId,
      status: 'pending',
    });
    return this.reservationRepository.save(reservation);
  }

  async cancel(id: number) {
    const reservation = await this.findOne(id);
    if (reservation.status !== 'pending') throw new BadRequestException('Only pending reservations can be cancelled');
    reservation.status = 'cancelled';
    return this.reservationRepository.save(reservation);
  }

  async fulfill(id: number) {
    const reservation = await this.findOne(id);
    if (reservation.status !== 'pending') throw new BadRequestException('Only pending reservations can be fulfilled');
    reservation.status = 'fulfilled';
    return this.reservationRepository.save(reservation);
  }

  async getPendingReservations() {
    return this.reservationRepository.find({ where: { status: 'pending' }, relations: ['book', 'student'] });
  }
}
