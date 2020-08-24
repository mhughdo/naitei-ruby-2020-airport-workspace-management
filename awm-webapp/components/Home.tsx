import {Calendar, Badge, PageHeader} from 'antd'
import {Box} from 'theme-ui'

function getListData(value) {
  let listData
  switch (value.date()) {
    case 8:
      listData = [
        {type: 'warning', content: 'This is warning event.'},
        {type: 'success', content: 'This is usual event.'},
      ]
      break
    case 10:
      listData = [
        {type: 'warning', content: 'This is warning event.'},
        {type: 'success', content: 'This is usual event.'},
        {type: 'error', content: 'This is error event.'},
      ]
      break
    case 15:
      listData = [
        {type: 'warning', content: 'This is warning event'},
        {type: 'success', content: 'This is very long usual event。。....'},
        {type: 'error', content: 'This is error event 1.'},
        {type: 'error', content: 'This is error event 2.'},
        {type: 'error', content: 'This is error event 3.'},
        {type: 'error', content: 'This is error event 4.'},
      ]
      break
    default:
  }
  return listData || []
}

function dateCellRender(value) {
  const listData = getListData(value)
  return (
    <ul className='events'>
      {listData.map((item) => (
        <li key={item.content}>
          <Badge status={item.type} text={item.content} />
        </li>
      ))}
    </ul>
  )
}

function getMonthData(value) {
  return 1394
}

function monthCellRender(value) {
  const num = getMonthData(value)
  return num ? (
    <div className='notes-month'>
      <section>{num}</section>
      <span>Backlog number</span>
    </div>
  ) : null
}

const HomeComponent = () => {
  return (
    <Box
      sx={{
        bg: 'white',
      }}>
      <PageHeader
        sx={{
          fontSize: 5,
        }}
        title='Timesheet'
      />
      <Box
        sx={{
          p: 7,
          pt: 0,
        }}>
        <Calendar
          dateCellRender={dateCellRender}
          monthCellRender={monthCellRender}
        />
      </Box>
    </Box>
  )
}

export default HomeComponent
