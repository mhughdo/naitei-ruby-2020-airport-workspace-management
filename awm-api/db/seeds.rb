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

RequestStatus.create(name: 'Absence')

Shift.create(time_start: 1, time_end: 9)
Shift.create(time_start: 9, time_end: 17)

UserStatus.create(name: 'Pending')
UserStatus.create(name: 'Active')
UserStatus.create(name: 'Resignation')

Unit.create(name: 'Handico', description: 'blabla')
Unit.create(name: 'BA', description: 'blabla')
