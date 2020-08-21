class PublicUserFormat < Grape::Entity
  expose :id
  expose :email
  expose :name
  expose :gender_name
  expose :position_name
  expose :unit_name
end
