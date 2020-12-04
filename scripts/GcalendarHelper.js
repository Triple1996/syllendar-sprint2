export function parseData (event) {
    
    const title = event.summary;
    let startdt;
    let starttm;
    let enddt;
    let endtm;
    const location = (event.location ? event.location : 'N/A');
    const des = (event.description ? event.description : 'N/A');

    if (event.start.date) { // If all day event
        const startdtsplit = event.start.date.split('-');
        startdt = [startdtsplit[1], startdtsplit[2], startdtsplit[0]].join('/');
        starttm = '00:00';
        const enddtsplit = event.end.date.split('-');
        enddt = [enddtsplit[1], enddtsplit[2], enddtsplit[0]].join('/');
        endtm = '00:00';
    } 
    else { // Not all day event
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
        startdt = [startdtsplit[1], startdtsplit[2], startdtsplit[0]].join('/');
        starttm = rawStartDateTimeSplit[1].split('-')[0].substring(0, 5);
        const enddtsplit = rawEndDateTimeSplit[0].split('-');
        enddt = [enddtsplit[1], enddtsplit[2], enddtsplit[0]].join('/');
        endtm = rawEndDateTimeSplit[1].split('-')[0].substring(0, 5);
    }

    const createdBy = event.creator.email;
    return {
        "createdBy" : createdBy, 
        "title" : title, 
        "startdt" : startdt, 
        "starttm" : starttm, 
        "enddt" : enddt, 
        "endtm" : endtm, 
        "location" : location, 
        "des" : des
    }

}