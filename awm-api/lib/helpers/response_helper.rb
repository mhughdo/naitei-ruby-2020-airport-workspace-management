module ResponseHelper
  def render_success_response status, data, message
    render json: {
      success: true,
      data: data,
      message: message
    }, status: status
  end

  def render_fail_response status, errors
    render json: {
      success: false,
      errors: errors
    }, status: status
  end
end
