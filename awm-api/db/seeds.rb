# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

Gender.create(name: "Male")
Gender.create(name: "Female")
Gender.create(name: "Others")

Position.create(name: "Employee")
Position.create(name: "Manager")
Position.create(name: "Admin")

RequestStatus.create(name: "Pending")
RequestStatus.create(name: "Approved")
RequestStatus.create(name: "Rejected")

Shift.create(name: "Shift 1", time_start: "06:30", time_end: "14:30")
Shift.create(name: "Shift 2", time_start: "14:30", time_end: "22:30")
Shift.create(name: "Shift 3", time_start: "22:30", time_end: "06:30")

UserStatus.create(name: "Pending")
UserStatus.create(name: "Active")
UserStatus.create(name: "Resignation")

Unit.create(name: "HR", description: "blabla")
Unit.create(name: "BA", description: "blabla")
Unit.create(name: "WarehouseManagement", description: "blabla")
Unit.create(name: "StoreManagement", description: "blabla")
Unit.create(name: "FlightManagement", description: "blabla")
Unit.create(name: "BookingManagement", description: "blabla")

WorkTimeStatus.create(name: "Late")
WorkTimeStatus.create(name: "On Time")
WorkTimeStatus.create(name: "Absence")

User.create(
  name: "Admin",
  email: "admin@gmail.com",
  password: "123456",
  password_confirmation: "123456",
  address: "Ha Noi",
  phone: "0123456789",
  shift_id: 1,
  position_id: 3,
  unit_id: 2,
  gender_id: 1,
  user_status_id: 2,
  birthday: Time.now.to_i.to_s << "000"
)

10.times do |n|
  name = Faker::Name.name
  email = "user#{n+1}@gmail.com"
  password = "123456"
  user = User.create!(
    name: name,
    email: email,
    password: password,
    password_confirmation: password,
    address: "Ha Noi",
    phone: "0123456789",
    shift_id: Faker::Number.between(from: 1, to: 2),
    position_id: Faker::Number.between(from: 1, to: 3),
    unit_id: Faker::Number.between(from: 1, to: 6),
    gender_id: Faker::Number.between(from: 1, to: 2),
    user_status_id: Faker::Number.between(from: 1, to: 3),
    birthday: Time.now.to_i.to_s << "000"
  )
  current_month = Time.now.month

  current_month.times do |month|
    days = 0
    case month + 1
    when 1, 3, 5, 7, 8, 10, 12
      days = 31
    when 4, 6, 9, 11
      days = 30
    else
      days = 29
    end
    days = Time.now.day if month + 1 == current_month

    days.times do |day|
      shift = Shift.find_by id: user.shift_id
      time_start_hour = shift.time_start.split(":")[0].to_i
      time_start_minute = shift.time_start.split(":")[1].to_i
      time_end_hour = shift.time_end.split(":")[0].to_i
      time_end_minute = shift.time_end.split(":")[1].to_i
      time_start = 0
      time_end = 0
      work_time_status_id = 2
      if shift.id == 3
        time_start = Faker::Number.between(
          from: Time.new(2020, month + 1, day + 1, time_start_hour, time_start_minute - 15).to_i,
          to: Time.new(2020, month + 1, day + 2, time_start_hour, time_start_minute + 5, 0).to_i
        )
        time_end = Faker::Number.between(
          from: Time.new(2020, month + 1, day + 1, time_end_hour, time_end_minute).to_i,
          to: Time.new(2020, month + 1, day + 2, time_end_hour, time_end_minute + 15).to_i
        )
      else
        time_start = Faker::Number.between(
          from: Time.new(2020, month + 1, day + 1, time_start_hour, time_start_minute - 15).to_i,
          to: Time.new(2020, month+ 1, day + 1, time_start_hour, time_start_minute + 5).to_i
        )
        time_end = Faker::Number.between(
          from: Time.new(2020, month+ 1, day + 1, time_end_hour, time_end_minute).to_i,
          to: Time.new(2020, month + 1, day + 1, time_end_hour, time_end_minute + 15).to_i
        )
      end

      if Time.at(time_start).min > time_start_minute
        work_time_status_id = 1
      end

      WorkTime.create!(
        user_id: user.id,
        shift_id: user.shift_id,
        work_time_status_id: work_time_status_id,
        time_start: time_start.to_s,
        time_end: time_end.to_s,
        day: Time.at(time_start).day,
        month: Time.at(time_start).month,
        year: Time.at(time_start).year
      )
    end
  end
end
