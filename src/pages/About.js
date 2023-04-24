


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
        <h6 className='pt-2'> links</h6>
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




