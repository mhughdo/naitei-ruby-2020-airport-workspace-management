module ResponseHelper
  def render_success_response p_status, format, data, message
    status p_status
    present data, with: format, success: true, message: message
  end

  def render_notification p_status, notification
    status p_status
    present Object.new, with: NotificationFormat, message: notification
  end
end
