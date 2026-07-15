"use client";

import Link from "next/link";
import type { KeyboardEvent } from "react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing, Bot, Check, ChevronDown, ChevronRight, CreditCard, PackageCheck, ShoppingCart, UserRound } from "lucide-react";
import { industries } from "./site-data";

type Demo = "booking" | "pos" | "assist";

const aiReplies: Record<string, string> = {
  "What services do you offer?": "This sample business offers consultations, follow-up sessions, and business assessments.",
  "Do you have availability Saturday?": "Yes. The connected demonstration calendar shows openings at 10:30 AM and 2:30 PM this Saturday.",
  "Can I pay a deposit?": "Yes. A ₱500 deposit is required to confirm this sample booking. Payment rules depend on the approved provider.",
  "Where are you located?": "This sample business is located in Cebu City. I can share directions or transfer you to the team.",
  "Talk to a staff member": "A staff member has been notified and will continue this conversation.",
};

const bookingDates = [{ id:"wed-19", day:"Wed", date:"19", label:"Wednesday, June 19" }, { id:"thu-20", day:"Thu", date:"20", label:"Thursday, June 20" }, { id:"sat-22", day:"Sat", date:"22", label:"Saturday, June 22" }];
const allTimes = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM"];
const availability: Record<string, Record<string, string[]>> = {
  "Maria Santos": { "wed-19":["10:30 AM","2:30 PM"], "thu-20":["9:00 AM","1:00 PM"], "sat-22":["10:30 AM","2:30 PM"] },
  "James Rivera": { "wed-19":["9:00 AM","1:00 PM"], "thu-20":["10:30 AM","2:30 PM"], "sat-22":["9:00 AM"] },
  "Consultation Room 2": { "wed-19":["1:00 PM","2:30 PM"], "thu-20":["9:00 AM","10:30 AM"], "sat-22":["10:30 AM","1:00 PM"] },
};

function subscribeMobile(callback: () => void) { const media = window.matchMedia("(max-width: 800px)"); media.addEventListener("change", callback); window.addEventListener("resize", callback); return () => { media.removeEventListener("change", callback); window.removeEventListener("resize", callback); }; }
function getMobileSnapshot() { return window.matchMedia("(max-width: 800px)").matches; }
function getServerMobileSnapshot() { return false; }

export function ProductDemo() {
  const [demo, setDemo] = useState<Demo>("booking");
  const [booked, setBooked] = useState(false);
  const [service, setService] = useState("Signature consultation");
  const [staff, setStaff] = useState("Maria Santos");
  const [date, setDate] = useState("wed-19");
  const [time, setTime] = useState("10:30 AM");
  const [orderStep, setOrderStep] = useState(-1);
  const [orderRunning, setOrderRunning] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);
  const [reply, setReply] = useState("Hi! Choose a sample question below.");
  const [handoff, setHandoff] = useState(false);
  const tabs: { id: Demo; label: string }[] = [{ id:"booking", label:"Booking" }, { id:"pos", label:"POS & Inventory" }, { id:"assist", label:"AI Assistant" }];
  const posSteps = [
    [ShoppingCart,"New website order received"], [UserRound,"Order added to sales dashboard"], [CreditCard,"Payment status recorded"], [PackageCheck,"Inventory reduced by 2 units"], [BellRing,"Low-stock warning triggered"], [Check,"Daily sales total updated"], [UserRound,"Customer record updated"],
  ] as const;
  const selectedDate = bookingDates.find(item => item.id === date)!;
  const availableTimes = availability[staff][date];
  useEffect(() => {
    if (!orderRunning) return;
    const timer = window.setInterval(() => {
      setOrderStep(current => {
        if (current >= 6) {
          window.clearInterval(timer);
          setOrderRunning(false);
          return 6;
        }
        return current + 1;
      });
    }, 480);
    return () => window.clearInterval(timer);
  }, [orderRunning]);
  function updateStaff(value:string) { setStaff(value); setTime(availability[value][date][0]); setBooked(false); }
  function updateDate(value:string) { setDate(value); setTime(availability[staff][value][0]); setBooked(false); }
  function resetBooking() { setBooked(false); setService("Signature consultation"); setStaff("Maria Santos"); setDate("wed-19"); setTime("10:30 AM"); }
  function startOrder() { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setOrderStep(6); setOrderRunning(false); return; } setOrderStep(0); setOrderRunning(true); }
  function resetOrder() { setOrderRunning(false); setOrderStep(-1); }
  function selectReply(nextQuestion:string) { setQuestion(nextQuestion); setReply(aiReplies[nextQuestion]); setHandoff(nextQuestion === "Talk to a staff member"); }
  function resetAssistant() { setQuestion(null); setReply("Hi! Choose a sample question below."); setHandoff(false); }
  function demoTabKeydown(event:KeyboardEvent<HTMLButtonElement>,index:number) {
    if(!["ArrowRight","ArrowLeft","Home","End"].includes(event.key)) return;
    event.preventDefault();
    const next=event.key==="Home"?0:event.key==="End"?tabs.length-1:event.key==="ArrowRight"?(index+1)%tabs.length:(index-1+tabs.length)%tabs.length;
    setDemo(tabs[next].id);
    document.getElementById(`demo-tab-${tabs[next].id}`)?.focus();
  }

  return <section className="demo-section" id="demo"><div className="section-title split-title"><div><span className="eyebrow">PRODUCT DEMONSTRATION</span><h2>See how the systems work together.</h2></div><p>Explore a simplified demonstration of how Northstar handles bookings, sales, inventory, and customer questions.</p></div><p className="demo-disclaimer">Sample data shown for demonstration purposes.</p>
    <div className="demo-shell"><div className="demo-tabs" role="tablist" aria-label="Product demonstrations">{tabs.map((tab,index) => <button key={tab.id} id={`demo-tab-${tab.id}`} role="tab" aria-controls={`demo-panel-${tab.id}`} aria-selected={demo === tab.id} tabIndex={demo === tab.id ? 0 : -1} onKeyDown={event=>demoTabKeydown(event,index)} onClick={() => setDemo(tab.id)}>{tab.label}</button>)}</div>
      <AnimatePresence mode="wait"><motion.div id={`demo-panel-${demo}`} role="tabpanel" aria-labelledby={`demo-tab-${demo}`} className="demo-canvas" key={demo} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.24}}>
        {demo === "booking" && <div className="booking-demo"><div className="demo-summary"><span>SIMULATED BOOKING FLOW</span><h3>{booked ? "Booking confirmed." : "Choose an available appointment."}</h3><p>{booked ? "The confirmation reflects every selection made in this demonstration." : "Changing the staff member or date updates the available times. Unavailable slots cannot be selected."}</p>{booked && <button className="demo-reset" onClick={resetBooking}>Restart booking demo</button>}</div>
          <div className="booking-panel"><div className="mock-bar"><b>Northstar Wellness</b><span>Demo calendar</span></div>{!booked ? <><div className="booking-select"><label>Service<select value={service} onChange={event=>{setService(event.target.value);setBooked(false);}}><option>Signature consultation</option><option>Follow-up consultation</option><option>Business assessment</option></select></label><label>Staff or resource<select value={staff} onChange={event=>updateStaff(event.target.value)}><option>Maria Santos</option><option>James Rivera</option><option>Consultation Room 2</option></select></label></div>
            <div className="date-row" aria-label="Choose a date">{bookingDates.map(item => <button aria-pressed={date === item.id} className={date === item.id ? "active" : ""} onClick={() => updateDate(item.id)} key={item.id}>{item.day}<br/><b>{item.date}</b></button>)}</div>
            <div className="time-grid" aria-label="Choose an available time">{allTimes.map(label => { const unavailable = !availableTimes.includes(label); return <button disabled={unavailable} aria-pressed={time === label} aria-label={`${label}${unavailable ? ", unavailable" : ", available"}`} className={time === label ? "active" : ""} onClick={() => setTime(label)} key={label}>{label}{unavailable && <small>Unavailable</small>}</button>; })}</div>
            <div className="deposit-row"><span>Sample deposit requirement</span><b>₱500 due to confirm</b></div><button className="demo-primary" onClick={() => setBooked(true)} disabled={!time}>Confirm demonstration booking <ChevronRight size={18}/></button></> : <div className="confirmed"><div><Check size={34}/></div><span className="confirmation-label">DEMONSTRATION CONFIRMATION</span><h4>{selectedDate.label} · {time}</h4><p>{service}<br/>with {staff}</p><span>Deposit status: Sample ₱500 received</span><b>Reference NS-DEMO-2048</b></div>}</div></div>}

        {demo === "pos" && <div className="pos-demo"><p className="sr-only" aria-live="polite">{orderStep < 0 ? "Sample order ready." : orderStep === 6 ? "Connected order workflow complete." : posSteps[orderStep][1]}</p><div className="pos-stats"><article><span>Daily sales total</span><b>{orderStep >= 5 ? "₱28,450" : "₱26,950"}</b></article><article><span>Harbor Roast stock</span><b>{orderStep >= 3 ? "3 units" : "5 units"}</b></article><article className="alert"><span>Low-stock warning</span><b>{orderStep >= 4 ? "Triggered" : "Monitoring"}</b></article></div>
          <div className="pos-grid"><div className="order-card"><span>FICTIONAL SAMPLE ORDER</span><h3>Order #DEMO-1048</h3><div><b>2 × Harbor Roast Coffee</b><span>₱1,500</span></div><small>Sample customer: Ana Reyes · Website order</small><button className="demo-primary" onClick={startOrder} disabled={orderRunning}>{orderRunning ? "Processing connected workflow…" : orderStep === 6 ? "Run sample order again" : "Trigger sample website order"} <ShoppingCart size={17}/></button>{orderStep >= 0 && <button className="demo-reset" onClick={resetOrder}>Reset POS demonstration</button>}</div>
          <div className="activity-card"><span>CONNECTED WORKFLOW</span>{posSteps.map(([Icon,title],index) => { const complete=index<=orderStep; return <div key={title} className={complete?"complete":""}><Icon size={18}/><p><b>{title}</b><small>{complete ? "Completed in this demonstration" : "Waiting for previous step"}</small></p></div>; })}</div></div></div>}

        {demo === "assist" && <div className="assist-demo"><div className="assistant-info"><Bot size={30}/><span>CONTROLLED AI ASSISTANCE</span><h3>Useful answers, within clear boundaries.</h3><p>The assistant uses approved sample business information and connected demonstration availability. It does not invent missing details or provide medical, legal, accounting, or tax authority.</p><ul><li>Approved sample information</li><li>Connected calendar availability</li><li>Clear human handoff</li></ul></div><div className="chat-window"><div className="chat-head"><div><i/><b>Northstar Assistant</b></div><span>Demo online</span></div><div className="chat-body" aria-live="polite">{question&&<motion.p key={question} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className="user-message">{question}</motion.p>}<motion.p key={reply} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className="bot-message">{reply}</motion.p>{handoff && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="handoff-state"><UserRound size={17}/><span>A staff member has been notified and will continue this conversation.</span></motion.div>}</div><div className="quick-options">{Object.keys(aiReplies).map(nextQuestion => <button key={nextQuestion} aria-pressed={question===nextQuestion} onClick={() => selectReply(nextQuestion)}>{nextQuestion}</button>)}{question&&<button className="assistant-reset" onClick={resetAssistant}>Restart conversation</button>}</div></div></div>}
      </motion.div></AnimatePresence></div>
  </section>;
}

function IndustryContent({ industry, panelId, labelledBy, mode }: { industry:(typeof industries)[number]; panelId:string; labelledBy:string; mode:"tab"|"accordion" }) {
  return <div id={panelId} role={mode==="tab"?"tabpanel":"region"} aria-labelledby={labelledBy} className="industry-content"><div className="industry-copy"><span>COMMON OPERATIONAL PROBLEM</span><h3>{industry.name}</h3><p>{industry.problem}</p><div className="industry-outcome"><small>PRACTICAL OUTCOME</small><strong>{industry.outcome}</strong></div><div className="recommended-system"><small>RECOMMENDED NORTHSTAR SYSTEM</small><b>{industry.system}</b></div><ul>{industry.features.map(feature => <li key={feature}><Check size={17}/>{feature}</li>)}</ul><Link href="#contact">{industry.cta}<ChevronRight size={18}/></Link></div><div className="industry-demo"><div className="industry-demo-head"><span>SIMPLIFIED INTERFACE DEMO</span><small>Sample data</small></div>{industry.demo.map((item,index) => <div key={item} className={index===industry.demo.length-1?"is-result":""}><span>{String(index+1).padStart(2,"0")}</span><b>{item}</b>{index===industry.demo.length-1?<Check size={17}/>:<ChevronRight size={17}/>}</div>)}{industry.short==="Clinics"&&<p>FAQ assistance does not provide diagnoses or medical advice. Sensitive questions are handed to staff.</p>}</div></div>;
}

export function IndustrySelector() {
  const [active,setActive]=useState(0);
  const [mobileOpen,setMobileOpen]=useState(0);
  const isMobile=useSyncExternalStore(subscribeMobile,getMobileSnapshot,getServerMobileSnapshot);
  function tabKeydown(event:KeyboardEvent<HTMLButtonElement>,index:number){ if(!["ArrowDown","ArrowUp","Home","End"].includes(event.key))return; event.preventDefault(); const next=event.key==="Home"?0:event.key==="End"?industries.length-1:event.key==="ArrowDown"?(index+1)%industries.length:(index-1+industries.length)%industries.length; setActive(next); document.getElementById(`industry-tab-${next}`)?.focus(); }
  return <section className="industry-selector" id="industries"><div className="section-title split-title"><div><span className="eyebrow">INDUSTRY SYSTEMS</span><h2>Built for how your business operates.</h2></div><p>Select an industry to see the operational problem, practical outcome, recommended system, capabilities, and simplified interface flow.</p></div>
    {!isMobile ? <div className="industry-interface desktop-industries"><div className="industry-tabs" role="tablist" aria-label="Industries" aria-orientation="vertical">{industries.map((item,index)=><button key={item.name} id={`industry-tab-${index}`} role="tab" aria-controls="industry-desktop-panel" aria-selected={active===index} tabIndex={active===index?0:-1} onKeyDown={event=>tabKeydown(event,index)} onClick={()=>setActive(index)}><span>0{index+1}</span>{item.short}<ChevronRight size={18}/></button>)}</div><AnimatePresence mode="wait"><motion.div key={industries[active].name} className="industry-panel" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}}><IndustryContent industry={industries[active]} panelId="industry-desktop-panel" labelledBy={`industry-tab-${active}`} mode="tab"/></motion.div></AnimatePresence></div>
    : <div className="mobile-industries">{industries.map((industry,index)=>{const open=mobileOpen===index;return <article key={industry.name}><button id={`industry-accordion-${index}`} aria-controls={`industry-mobile-panel-${index}`} aria-expanded={open} onClick={()=>setMobileOpen(open?-1:index)}><span><small>0{index+1}</small>{industry.name}</span><ChevronDown className={open?"rotate":""}/></button>{open&&<motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}}><IndustryContent industry={industry} panelId={`industry-mobile-panel-${index}`} labelledBy={`industry-accordion-${index}`} mode="accordion"/></motion.div>}</article>;})}</div>}
  </section>;
}
