


import React from 'react'
import ReactDOM from "react-dom";
import OwlCarousel from "react-owl-carousel";

import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { UnderlineOutlined } from '@ant-design/icons';

const options = {
    loop: true,
    margin: 40,
    nav: true,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      600: {
        items: 3,
      },
      1000: {
        items: 4,
      },
    },
  };

const About = () => {
  return (
    <div className='lights '>
      <div className='links'>
        <h6 className=''> links</h6>
        <a className='links' href='https://www.chauvetdj.com/chauvet-dj-dip-switch-calculator/'>Dip Switch Calculator</a>
        <a className='links' href='https://store.marinebeam.com/beam-angle-calculator-1/'>Beam angle Calculator</a>
     
        <a className='links' href='https://www.etcconnect.com/Support/Videos/'>ETC tutorial videos</a>

        
       



      </div>
      <h1 className='top-0 mb-5'>EOS TIPS</h1>
           <OwlCarousel className="owl-theme"  {...options}>
        <div className="item m-2  p-2 bg">
        <li>Use Query to select channels in specific conditions. E.g., [Query]Dark Moves – selects all channels that are at zero, but have non-intensity moves. Query can be filtered by fixture type, keywords, and conditions.</li>
          <img src='https://giftv.co/assets/images/image06.gif?v=3176bd34' />
         
          <li>[Sneak] [Sneak]&nbsp; Use to sneak all non-intensity parameters, leaving intensity for associated channels as currently set</li>
        </div>
        <div className="item m-2  p-2 bg">
        <li>Pressing and holding [About] + [Cue] will display the source of current data on stage – by cue list/number and/or sub number. </li>
          <img src='https://media0.giphy.com/media/rdma0nDFZMR32/200w.gif'/>
          
          <li>[Go to Cue] [Home] [Enter] – will go to the first cue of the selected list. [Go to Cue] [Shift] + [Home] [Enter] – will go to the last cue of the selected list.</li>
        </div>
        <div className="item m-2  p-2 bg">
        <li>[Replace with] in blind can be used to query for a specified value and replace with another value. E.g., Cue 1 thru 20 Enter. Channel list @ [Color Palette] [5] [Replace With] [Color Palette] [7] [Enter]</li>
          <img src='https://media0.giphy.com/media/rrmf3fICPZWg1MMXOW/200w.gif?cid=6c09b952trhardh289w5w3zbk1x1l2wd6cvvp6zfdzffzsvv&rid=200w.gif&ct=g'/>
          <li> 
          [Sub][Home][Thru][Home][Enter] will set all subs to their home positions (additive at zero and inhibitive at full). 
          </li>
       
        </div>
        <div className="item m-2  p-2 bg">
        <li>       Pressing and holding [About] + [Cue] will display the source of current data on stage  by cue list/number and/or sub number.
Pressing and holding [About] + [Live] will display the DMX values currently being output for channels/parameters.</li>
          <img src='https://media0.giphy.com/media/AcfTF7tyikWyroP0x7/giphy.gif'/>
          <li> 
   
Pressing and holding [About] + [Part] will expose the part structure for cues
Pressing and holding [About] + [Mark] will display the mark cue for channels/parameters.
          </li>
       
        </div>
        
        
        <div className="item m-2  p-2 bg">
        <li>      [Shift] + [Block] assigns an Intensity Only block to the selected cue.
[Shift] + [at] reselects the last channel and parameter set, leaving the command line open. This command loops five times..</li>
          <img src='https://cdn.vox-cdn.com/thumbor/a5EcHSnHLRfQyzSFvhmPSnibCq0=/0x0:420x314/1400x1400/filters:focal(136x115:202x181):format(gif)/cdn.vox-cdn.com/uploads/chorus_image/image/55279403/tenor.0.gif'/>
          <li> 
   
          Open fader configuration for a specific fader (set) from Live by pressing [Learn] and [Load]. Load on Ion XE is the two buttons under the fader.<br></br>
[About] held in combination with [Park], [Patch/Address], [Live], [Label], [Mark], [Next/Last], [Park], [Part], [Time] and [Path] toggle the displays to a variety of associated channel data.<br></br>
[Trace] [Trace] in live during an update or blind when setting channel data forces a previously inactive light to track its intensity value to the beginning of the cue list.<br></br>
[Timing Disable] (or [Shift]) and [Go] or [Back] cuts the related cue on stage<br></br>
          </li>
       
        </div>
      
      </OwlCarousel>

    </div>
  )
}

export default About




{/* <div className=" item lights"><li>[Sneak] [Sneak]&nbsp; Use to sneak all non-intensity parameters, leaving intensity for associated channels as currently set.</li></div>
<div className=" item lights">
<div className="item lights"><li>[Go to Cue] [Home] [Enter] – will go to the first cue of the selected list. [Go to Cue] [Shift] + [Home] [Enter] – will go to the last cue of the selected list.</li></div>
<div className="item lights"><li>[Sub][Home][Thru][Home][Enter] will set all subs to their home positions (additive at zero and inhibitive at full).</li></div>
<div className="item lights"><li>[Replace with] in blind can be used to query for a specified value and replace with another value. E.g., Cue 1 thru 20 Enter. Channel list @ [Color Palette] [5] [Replace With] [Color Palette] [7] [Enter]</li></div>
<div className="item lights"><li>Use Query to select channels in specific conditions. E.g., [Query]Dark Moves – selects all channels that are at zero, but have non-intensity moves. Query can be filtered by fixture type, keywords, and conditions.</li></div>
Pressing and holding [About] + [Cue] will display the source of current data on stage – by cue list/number and/or sub number.</li></div>
Pressing and holding [About] + [Live] will display the DMX values currently being output for channels/parameters.</li></div>
Pressing and holding [About] + [Part] will expose the part structure for cues.</li></div>
Pressing and holding [About] + [Mark] will display the mark cue for channels/parameters.</li></div>
[Shift] + [Block] assigns an Intensity Only block to the selected cue.
[Shift] + [at] reselects the last channel and parameter set, leaving the command line open. This command loops five times.

Open fader configuration for a specific fader (set) from Live by pressing [Learn] and [Load]. Load on Ion XE is the two buttons under the fader.
[About] held in combination with [Park], [Patch/Address], [Live], [Label], [Mark], [Next/Last], [Park], [Part], [Time] and [Path] toggle the displays to a variety of associated channel data.
[Trace] [Trace] in live during an update or blind when setting channel data forces a previously inactive light to track its intensity value to the beginning of the cue list.
[Timing Disable] (or [Shift]) and [Go] or [Back] cuts the related cue on stage
[Shift] and [Gel Tile] from the color picker cycles through the three options for setting gel matches (brightest, best spectral or hybrid).
The channel display indicates which gel match you have by dots to the left of the gel reference.
[Shift] + Direct Select Tile posts the content to the command line, unterminated, so that a sneak time can be applied to the execution.
[Shift] and [About] opens a content search window, which respects the category on the command line at the point of access.
If you are experiencing a problem you need to report to ETC, hitting [Displays] and [Record] places a “look here” marker in the logs. This indicator helps us track down field issues.
Holding the Encoder page color key down while moving the color encoders acts as a “hold color point.” This is the same behavior as hold color in the color picker spectrum tools. */}