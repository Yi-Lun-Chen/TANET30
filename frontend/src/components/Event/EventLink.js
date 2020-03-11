import React from 'react';
import { Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const prefixZero = (num, len = 2) => {
  const raw = String(num);
  return raw.length < len ? "0".repeat(len-raw.length)+raw : raw;
}

const epochToTime = (_begin, _end) => {
  const begin = new Date(_begin);
  const end = new Date(_end);
  const year = begin.getFullYear();
  const beginMonth = begin.getMonth()+1;
  const endMonth = end.getMonth()+1;
  const beginDate = begin.getDate();
  const endDate = end.getDate();
  const beginHour = prefixZero(begin.getHours());
  const beginMinute = prefixZero(begin.getMinutes());
  const endHour = prefixZero(end.getHours());
  const endMinute = prefixZero(end.getMinutes());
  return `${year} ${beginMonth}/${beginDate} ${beginHour}:${beginMinute} ~ ${endMonth}/${endDate} ${endHour}:${endMinute}`;
}

const EventLink = ({name, id, begin, end}) => (
  <Card as={Link} to={`/event?id=${id}`} link>
    <Card.Content>
      <Card.Header>{name}</Card.Header>
      <Card.Meta>
        <span className='date'>{epochToTime(begin, end)}</span>
      </Card.Meta>
    </Card.Content>
  </Card>
)

export default EventLink;