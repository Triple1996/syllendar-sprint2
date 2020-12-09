import React from 'react'

export default function UpdateEvent({ eventInfo }) {
    console.log(eventInfo);
    return (
        <div>
            <div className="row">
                <div className="col-4 text-left">
                    <p>Event Name</p>
                </div>
                <div className="col-8 text-left">
                    <p>{eventInfo.Event}</p>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-left">
                    <p>Start Time</p>
                </div>
                <div className="col-8 text-left">
                    <p>{eventInfo.StartTime}</p>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-left">
                    <p>End Time</p>
                </div>
                <div className="col-8 text-left">
                    <p>{eventInfo.EndTime}</p>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-left">
                    <p>Location</p>
                </div>
                <div className="col-8 text-left">
                    <p>{eventInfo.Location}</p>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-left">
                    <p>Description</p>
                </div>
                <div className="col-8 text-left">
                    <p>{eventInfo.Description}</p>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-left">
                    <p>End Date</p>
                </div>
                <div className="col-8 text-left">
                    <p>{eventInfo.EndDate}</p>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-left">
                    <p>Event Name</p>
                </div>
                <div className="col-8 text-left">
                    <p>{eventInfo.Event}</p>
                </div>
            </div>
            
        </div>    
    )
}