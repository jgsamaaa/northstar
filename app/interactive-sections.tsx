"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing, Bot, Check, ChevronDown, ChevronRight, PackageCheck, ShoppingCart, UserRound } from "lucide-react";
import { industries } from "./site-data";

type Demo = "booking" | "pos" | "assist";

const aiReplies: Record<string, string> = {
  "What services do you offer?": "We offer websites, online booking, POS and inventory setup, AI customer assistance, automation, and ongoing support.",
  "Do you have availability Saturday?": "Yes. The demonstration calendar shows openings at 10:30 AM and 2:30 PM this Saturday.",
  "Can I pay a deposit?": "Yes. A ₱500 booking deposit can be collected through the approved payment provider.",
  "Where are you located?": "This sample business is located in Cebu City. I can share directions or transfer you to the team.",
  "Talk to a staff member": "Of course. I’ve captured this conversation and notified the team for a human follow-up.",
};

export function ProductDemo() {
  const [demo, setDemo] = useState<Demo>("booking");
  const [booked, setBooked] = useState(false);
  const [service, setService] = useState("Signature consultation");
  const [staff, setStaff] = useState("Maria Santos");
  const [time, setTime] = useState("10:30 AM");
  const [orderStep, setOrderStep] = useState(0);
  const [reply, setReply] = useState(aiReplies["What services do you offer?"]);
  const tabs: { id: Demo; label: string }[] = [{ id: "booking", label: "Booking" }, { id: "pos", label: "POS & Inventory" }, { id: "assist", label: "AI Assistant" }];
  const posSteps = ["Website order received", "Order entered the dashboard", "Sale recorded", "Inventory reduced by 2 units", "Low-stock alert created", "Daily sales report updated"];

  return <section className="demo-section" id="demo">
    <div className="section-title split-title"><div><span className="eyebrow">PRODUCT DEMONSTRATION</span><h2>See how the systems work together.</h2></div><p>Explore a simplified demonstration of how Northstar handles bookings, sales, inventory, and customer questions.</p></div>
    <p className="demo-disclaimer">Demonstration data only. These examples show product behavior, not client results.</p>
    <div className="demo-shell">
      <div className="demo-tabs" role="tablist" aria-label="Product demonstrations">{tabs.map(tab => <button key={tab.id} role="tab" aria-selected={demo === tab.id} onClick={() => setDemo(tab.id)}>{tab.label}</button>)}</div>
      <AnimatePresence mode="wait"><motion.div className="demo-canvas" key={demo} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .24 }}>
        {demo === "booking" && <div className="booking-demo">
          <div className="demo-summary"><span>SIMULATED BOOKING FLOW</span><h3>{booked ? "Booking confirmed." : "Choose a time that works."}</h3><p>{booked ? "The customer and assigned staff member receive the approved confirmation automatically." : "Select a service, staff member, date, and an available time. Unavailable slots cannot be selected."}</p>{booked && <button className="demo-reset" onClick={() => setBooked(false)}>Start again</button>}</div>
          <div className="booking-panel"><div className="mock-bar"><b>Northstar Wellness</b><span>Demo calendar</span></div>{!booked ? <>
            <div className="booking-select"><label>Service<select value={service} onChange={event => setService(event.target.value)}><option>Signature consultation</option><option>Follow-up consultation</option><option>Business assessment</option></select></label><label>Staff or resource<select value={staff} onChange={event => setStaff(event.target.value)}><option>Maria Santos</option><option>James Rivera</option><option>Consultation Room 2</option></select></label></div>
            <div className="date-row"><button>Tue<br/><b>18</b></button><button className="active">Wed<br/><b>19</b></button><button>Thu<br/><b>20</b></button></div>
            <div className="time-grid">{[{ label:"9:00 AM", unavailable:true },{ label:"10:30 AM" },{ label:"1:00 PM", unavailable:true },{ label:"2:30 PM" }].map(slot => <button disabled={slot.unavailable} aria-label={`${slot.label}${slot.unavailable ? ", unavailable" : ""}`} className={time === slot.label ? "active" : ""} onClick={() => setTime(slot.label)} key={slot.label}>{slot.label}{slot.unavailable && <small>Unavailable</small>}</button>)}</div>
            <div className="deposit-row"><span>Deposit status</span><b>₱500 due today</b></div><button className="demo-primary" onClick={() => setBooked(true)}>Confirm booking <ChevronRight size={18}/></button>
          </> : <div className="confirmed"><div><Check size={34}/></div><h4>Wednesday, {time}</h4><p>{service} with {staff}</p><span>Deposit received · Reference NS-2048</span></div>}</div>
        </div>}

        {demo === "pos" && <div className="pos-demo">
          <div className="pos-stats"><article><span>Today’s sales</span><b>{orderStep >= 5 ? "₱28,450" : "₱26,950"}</b></article><article><span>House Blend stock</span><b>{orderStep >= 3 ? "3 units" : "5 units"}</b></article><article className="alert"><span>Low stock</span><b>{orderStep >= 4 ? "Alert active" : "Monitoring"}</b></article></div>
          <div className="pos-grid"><div className="order-card"><span>DEMONSTRATION ORDER</span><h3>Order #1048</h3><div><b>2 × Northstar House Blend</b><span>₱1,500</span></div><small>Customer: Ana Reyes · Website order</small><button className="demo-primary" onClick={() => setOrderStep(step => Math.min(step + 1, 5))}>{orderStep === 5 ? "Replay complete" : orderStep === 0 ? "Receive website order" : "Continue workflow"} <ShoppingCart size={17}/></button>{orderStep > 0 && <button className="demo-reset" onClick={() => setOrderStep(0)}>Reset demonstration</button>}</div>
          <div className="activity-card"><span>CONNECTED WORKFLOW</span>{posSteps.map((title, index) => { const icons = [ShoppingCart, UserRound, ShoppingCart, PackageCheck, BellRing, Check]; const ItemIcon = icons[index]; const complete = index <= orderStep; return <div key={title} className={complete ? "complete" : ""}><ItemIcon size={18}/><p><b>{title}</b><small>{complete ? "Completed in this demonstration" : "Waiting for previous step"}</small></p></div>; })}</div></div>
        </div>}

        {demo === "assist" && <div className="assist-demo"><div className="assistant-info"><Bot size={30}/><span>CONTROLLED AI ASSISTANCE</span><h3>Useful answers, within clear boundaries.</h3><p>The assistant uses approved business information and connected demonstration availability. It does not invent details and can hand the conversation to a person.</p><ul><li>Approved information only</li><li>Calendar availability</li><li>Clear human handoff</li></ul></div><div className="chat-window"><div className="chat-head"><div><i/><b>Northstar Assistant</b></div><span>Demo online</span></div><div className="chat-body"><p className="bot-message">Hi! Choose a sample question below.</p><motion.p key={reply} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} className="bot-message">{reply}</motion.p></div><div className="quick-options">{Object.keys(aiReplies).map(option => <button key={option} onClick={() => setReply(aiReplies[option])}>{option}</button>)}</div></div></div>}
      </motion.div></AnimatePresence>
    </div>
  </section>;
}

function IndustryContent({ industry }: { industry: (typeof industries)[number] }) {
  return <div className="industry-content"><div className="industry-copy"><span>COMMON OPERATIONAL PROBLEM</span><h3>{industry.name}</h3><p>{industry.problem}</p><div className="recommended-system"><small>RECOMMENDED NORTHSTAR SYSTEM</small><b>{industry.system}</b></div><ul>{industry.features.map(feature => <li key={feature}><Check size={17}/>{feature}</li>)}</ul><Link href="#contact">{industry.cta}<ChevronRight size={18}/></Link></div><div className="industry-demo"><div className="industry-demo-head"><span>SIMPLIFIED INTERFACE DEMO</span><small>Demonstration data</small></div>{industry.demo.map((item, index) => <div key={item} className={index === industry.demo.length - 1 ? "is-result" : ""}><span>{String(index + 1).padStart(2,"0")}</span><b>{item}</b>{index === industry.demo.length - 1 ? <Check size={17}/> : <ChevronRight size={17}/>}</div>)}{industry.short === "Clinics" && <p>FAQ assistance does not provide diagnoses or medical advice. Sensitive questions are handed to staff.</p>}</div></div>;
}

export function IndustrySelector() {
  const [active, setActive] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(0);
  return <section className="industry-selector" id="industries"><div className="section-title split-title"><div><span className="eyebrow">INDUSTRY SYSTEMS</span><h2>Built for how your business operates.</h2></div><p>Select an industry to see the operational problem, recommended system, practical capabilities, and a simplified interface flow.</p></div>
    <div className="industry-interface desktop-industries"><div className="industry-tabs" role="tablist" aria-label="Industries">{industries.map((item,index) => <button key={item.name} role="tab" aria-selected={active === index} onClick={() => setActive(index)}><span>0{index + 1}</span>{item.short}<ChevronRight size={18}/></button>)}</div><AnimatePresence mode="wait"><motion.div key={industries[active].name} className="industry-panel" initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}}><IndustryContent industry={industries[active]}/></motion.div></AnimatePresence></div>
    <div className="mobile-industries">{industries.map((industry,index) => { const open = mobileOpen === index; return <article key={industry.name}><button aria-expanded={open} onClick={() => setMobileOpen(open ? -1 : index)}><span><small>0{index + 1}</small>{industry.name}</span><ChevronDown className={open ? "rotate" : ""}/></button>{open && <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}}><IndustryContent industry={industry}/></motion.div>}</article>; })}</div>
  </section>;
}
