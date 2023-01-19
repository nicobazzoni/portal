import React from 'react'
import ReactDOM from "react-dom";
import OwlCarousel from "react-owl-carousel";

import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

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

const Lights = () => {
  return (
    <div className='light'>
      <h1 className='top-0 mb-5'>Lights in Use</h1>
           <OwlCarousel className="owl-theme"  {...options}>
        <div className="item m-2  p-2 bg">
        <p>S60-Ckit</p>
          <img src='https://www.arri.com/resource/responsive-image/32396/contentstage/lg/4/skypanel-s60-c-stage.png' />
         
          <p>Using technology originally designed for the L7-C Fresnel, the SkyPanel S60-C can be adjusted to output a warm 2800K to icy blue 10,000K light and also uses the full RGB+W color gamut with hue and saturation control for fine adjustments. Full Minusgreen to Full Plusgreen is also possible, so if you're lighting for blue or greenscreen, you can simply dial in your chosen color. This wide degree of control is responsible for a high CRI of 95 and a rating of 90 with the newer TLCI standard. All of these functions as well as 0-100% dimming can be adjusted locally with the SkyPanel's onboard controller or remotely via DMX or a LAN. Besides inputs and outputs appropriate to these functions, the light also has a USB-A port for downloading firmware upgrades from a thumb drive or any PC/Mac.</p>
        </div>
        <div className="item m-2  p-2 bg">
        <p>ETC Source Four Series 2 Lustr </p>
          <img src='https://www.bhphotovideo.com/cdn-cgi/image/format=auto,fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/etc_7461a1051_source_four_led_series_1667834419_1054545.jpg'/>
          
          <p>The black Source Four LED Series 2 Lustr with Shutter Barrel from ETC is an LED fixture that utilizes the seven color x7 system with 60 Luxeon Rebel LEDs to create quality light in a range of colors. This light engine is capable of CRIs over 90 when balanced to 5600K, and the LEDs have a long lifetime of 20,000 hours before dropping to 70% intensity. Also, there is a 15-bit virtual dimming engine for smooth transitions without color shifts.
 The Series 2 Lustr has remote control with DMX512 using 5-pin XLR connectors. Multiple lights can be linked for synchronization, and there is also RDM functionality. The physical characteristics of the light include a quiet fan cooling system and a durable die-cast aluminum construction. It is IP20- and UL1573-certified, comes with a hanging yoke mount, and has a universal 100-240 VAC power supply. Additionally, a separately-available lens tube is required for use. Light Quality LED array with 60 Luxeon Rebel emitters x7 Color System with red, green, amber, cyan, blue, indigo, and lime LEDs Brightness of the array is about 6500 lumens Beam has 2-to-1 center-to-edge drop-off ratio LED lifetime is about 20,000 before dropping to 70% intensity Requires separate lens tube for use</p>
        </div>
        <div className="item m-2  p-2 bg">
        <p>L-series</p>
          <img src='https://www.arri.com/resource/responsive-image/180886/contentstage/lg/2/l-series-stage.jpg'/>
          <p>The L-Series is the first LED fixture to truly incorporate the Fresnel characteristics of continuous focusability from spot to flood and a smooth, homogenous light field. The L-Series takes full advantage of LED technology and allows for complete control over the color and intensity of light. Light emitted from the L-Series is specifically calibrated for optimal reproduction on broadcast and digital cinema cameras, ensuring pleasing skin tones and vividly rendered colors. 
            Constructed to be robust and ergonomic, the L-Series meets the quality and design standard for which ARRI is known. At the heart of the L-Series are a few core concepts: tuneability, color fidelity, high build quality and ease of use. Three simple knobs permit the brightness, color temperature and green/magenta point to be fine-tuned, while a focus knob on the side of each fixture allows for smooth adjustment of the beam spread, just like conventional sources.</p>
        </div>
      
      </OwlCarousel>

    </div>
  )
}

export default Lights