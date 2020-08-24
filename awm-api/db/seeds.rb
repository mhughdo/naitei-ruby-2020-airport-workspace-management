# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Gender.create(name: 'Male')
Gender.create(name: 'Female')

Position.create(name: 'Employee')
Position.create(name: 'Manager')
Position.create(name: 'Admin')

RequestStatus.create(name: 'Pending')
RequestStatus.create(name: 'Aprroved')
RequestStatus.create(name: 'Rejected')

Shift.create(name: 'Shift 1', time_start: 1, time_end: 9)
Shift.create(name: 'Shift 2', time_start: 9, time_end: 17)

UserStatus.create(name: 'Pending')
UserStatus.create(name: 'Active')
UserStatus.create(name: 'Resignation')

Unit.create(name: 'HR', description: 'blabla')
Unit.create(name: 'BA', description: 'blabla')
Unit.create(name: 'WarehouseManagement', description: 'blabla')
Unit.create(name: 'StoreManagement', description: 'blabla')
Unit.create(name: 'FlightManagement', description: 'blabla')
Unit.create(name: 'BookingManagement', description: 'blabla')

User.create(
  name: 'Admin',
  email: 'admin@gmail.com',
  password: '123456',
  password_confirmation: '123456',
  address: 'Ha Noi',
  phone: '0123456789',
  shift_id: 1,
  position_id: 3,
  unit_id: 2,
  gender_id: 1,
  user_status_id: 2,
  birthday: Time.now.to_i.to_s << "000"
)
