import React from 'react';
import './ScheduleCalendar.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

class ScheduleCalendar extends React.Component {
    render() {
		const { events, className } = this.props;
        return (
            <div className={`schedulecalendar-component ${className || ''}`}>
				<FullCalendar
					defaultView="dayGridMonth"
					plugins={[ dayGridPlugin ]}
					fixedWeekCount={false}
					navLinks={true}
					eventLimit={true}
					header={{
						left: 'prev,next today',
						center: 'title',
						right: 'dayGridMonth,dayGridWeek,dayGridDay'
					}}
					events={events || []}
				/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(withRouter(ScheduleCalendar));