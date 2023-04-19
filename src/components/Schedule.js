
import React from 'react'

const Schedule = () => {
 const schedule = [
            { time: "4 - 5 am", show: "Fox and Friends First" },
            { time: "6 - 9 am", show: "Fox and Friends" },
            { time: "9 - 11 am", show: "America's Newsroom" },
            { time: "11 - 12a", show: "Faulkner Focus" },
            { time: "12 - 1 pm", show: "Outnumbered" },
            { time: "1 - 3 pm", show: "America Reports" },
            { time: "3 - 4 pm", show: "The Story with Martha MacCallum" },
            { time: "4 - 5 ", show: "Your World with Neil Cavuto"},
            { time: "5 - 6 pm", show: "The Five" },
            { time: "6p-7p", show: "Special Report" },
            { time: "7p-8p", show: "Watter's World" },
            { time: "8p-9p", show: "Tucker Carlson Tonight" },
            { time: "9p-10p", show: "Hannity" },
            { time: "10p-11p", show: "The Ingraham Angle" },
            { time: "11p-12p", show: "Gutfeld" },
           

        ]

        const business = [
            { btime: "6 - 9 am", show: "Mornings With Maria" },
            { btime: "9 - 12 am", show: "Varney" },
            { btime: "12 - 1 pm", show: "Coast To Coast" },
            { btime: "1 - 2 pm", show: "The Big Money Show" },
            { btime: "2 - 3 pm", show: "Making Money " },
            { btime: "2 - 3 pm", show: "America Reports" },
            { btime: "4 - 5 pm ", show: "Kudlow" },
            { btime: "5 - 6 pm", show: "Evening Edit" },
            { btime: "6 - 7 pm", show: "The Bottom Line" },
            { btime: "7 - 8 pm", show: "Kennedy" },
            { btime: "8p-9p", show: "Tucker Carlson Tonight" },
            { btime: "9p-10p", show: "Hannity" },
            { btime: "10p-11p", show: "The Ingraham Angle" },
            
           

        ]
        return (
            <div className='bgBlue p-4 schedule'>
                <h1 className='text-center'>Fox News Schedule</h1>
                <table className='table table-striped table-dark'>
                 
                    <tbody>
                        {schedule.map((show) => (
                            <tr key={show.time}>
                                <td>{show.time}</td>
                                <td>{show.show}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h1 className='text-center'>Fox Business Schedule</h1>
                <table className='table table-striped table-dark'>
                 
                    <tbody>
                        {business.map((show) => (
                            <tr key={show.btime}>
                                <td>{show.btime}</td>
                                <td>{show.show}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </div>
        )
}

export default Schedule