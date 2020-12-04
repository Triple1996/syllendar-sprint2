export default function parseData(event) {
  const START = 0;
  const TIME_FORMAT_LENGTH = 5;

  const title = event.summary;
  let startDate;
  let startTime;
  let endDate;
  let endTime;
  const location = (event.location ? event.location : 'N/A');
  const des = (event.description ? event.description : 'N/A');

  if (event.start.date) { // If all day event
    const startdtsplit = event.start.date.split('-');
    startDate = [startdtsplit[1], startdtsplit[2], startdtsplit[0]].join('/');
    startTime = '00:00';
    const enddtsplit = event.end.date.split('-');
    endDate = [enddtsplit[1], enddtsplit[2], enddtsplit[0]].join('/');
    endTime = '00:00';
  } else { // Not all day event
    const rawStartDateTimeSplit = event.start.dateTime.split('M').join(',').split('T').join(',')
      .split('W')
      .join(',')
      .split('F')
      .join(',')
      .split('S')
      .join(',')
      .split(',');
    const rawEndDateTimeSplit = event.end.dateTime.split('M').join(',').split('T').join(',')
      .split('W')
      .join(',')
      .split('F')
      .join(',')
      .split('S')
      .join(',')
      .split(',');

    const startdtsplit = rawStartDateTimeSplit[0].split('-');
    startDate = [startdtsplit[1], startdtsplit[2], startdtsplit[0]].join('/');
    startTime = rawStartDateTimeSplit[1].split('-')[0].substring(START, TIME_FORMAT_LENGTH);
    const enddtsplit = rawEndDateTimeSplit[0].split('-');
    endDate = [enddtsplit[1], enddtsplit[2], enddtsplit[0]].join('/');
    endTime = rawEndDateTimeSplit[1].split('-')[0].substring(START, TIME_FORMAT_LENGTH);
  }

  const createdBy = event.creator.email;
  return {
    createdBy,
    title,
    startdt: startDate,
    starttm: startTime,
    enddt: endDate,
    endtm: endTime,
    location,
    des,
  };
}
