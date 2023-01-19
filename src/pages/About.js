import React from "react";

const About = () => {
  return (
    <div className="container padding">
      <div className="col-md-12">
        <div className="row mx-0 mt-5 p-3">
          <p className="place-items-evenly">
          Eos Tips
          <ul className="lights">
<li>[Sneak] [Sneak]&nbsp; Use to sneak all non-intensity parameters, leaving intensity for associated channels as currently set.</li>
<li>[Sub][Home][Thru][Home][Enter] will set all subs to their home positions (additive at zero and inhibitive at full).</li>
<li>[Go to Cue] [Home] [Enter] – will go to the first cue of the selected list. [Go to Cue] [Shift] + [Home] [Enter] – will go to the last cue of the selected list.</li>
<li>[Replace with] in blind can be used to query for a specified value and replace with another value. E.g., Cue 1 thru 20 Enter. Channel list @ [Color Palette] [5] [Replace With] [Color Palette] [7] [Enter]</li>
<li>Use Query to select channels in specific conditions. E.g., [Query]Dark Moves – selects all channels that are at zero, but have non-intensity moves. Query can be filtered by fixture type, keywords, and conditions.</li>
<li>Pressing and holding [About] + [Cue] will display the source of current data on stage – by cue list/number and/or sub number.</li>
<li>Pressing and holding [About] + [Live] will display the DMX values currently being output for channels/parameters.</li>
<li>Pressing and holding [About] + [Part] will expose the part structure for cues.</li>
<li>Pressing and holding [About] + [Mark] will display the mark cue for channels/parameters.</li>
<li>[Shift] + [Block] assigns an Intensity Only block to the selected cue.</li>
<li>[Shift] + [at] reselects the last channel and parameter set, leaving the command line open. This command loops five times.</li>
</ul>
<ul>
<li>Open fader configuration for a specific fader (set) from Live by pressing [Learn] and [Load]. Load on Ion XE is the two buttons under the fader.</li>
<li>[About] held in combination with [Park], [Patch/Address], [Live], [Label], [Mark], [Next/Last], [Park], [Part], [Time] and [Path] toggle the displays to a variety of associated channel data.</li>
<li>[Trace] [Trace] in live during an update or blind when setting channel data forces a previously inactive light to track its intensity value to the beginning of the cue list.</li>
<li>[Timing Disable] (or [Shift]) and [Go] or [Back] cuts the related cue on stage</li>
<li>[Shift] and [Gel Tile] from the color picker cycles through the three options for setting gel matches (brightest, best spectral or hybrid).</li>
<li>The channel display indicates which gel match you have by dots to the left of the gel reference.</li>
<li>[Shift] + Direct Select Tile posts the content to the command line, unterminated, so that a sneak time can be applied to the execution.</li>
<li>[Shift] and [About] opens a content search window, which respects the category on the command line at the point of access.</li>
<li>If you are experiencing a problem you need to report to ETC, hitting [Displays] and [Record] places a “look here” marker in the logs. This indicator helps us track down field issues.</li>
<li>Holding the Encoder page color key down while moving the color encoders acts as a “hold color point.” This is the same behavior as hold color in the color picker spectrum tools.</li>
</ul>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;