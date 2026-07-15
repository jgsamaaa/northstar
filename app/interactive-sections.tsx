"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing, Bot, Check, ChevronRight, PackageCheck, ShoppingCart, UserRound } from "lucide-react";
import { industries } from "./site-data";

type Demo = "booking" | "pos" | "assist";

const aiReplies: Record<string, string> = {
  Services: "We can help with websites, booking, POS and inventory, automation, and ongoing support.",
  Availability: "I can help you check availability. Which service and preferred date should I use?",
  "Talk to staff": "Of course. I’ve captured this conversation and notified the team for a human follow-up.",
};

export function ProductDemo() {
  const [demo, setDemo] = useState<Demo>("booking");
  const [booked, setBooked] = useState(false);
  const [order, setOrder] = useState(false);
  const [reply, setReply] = useState(aiReplies.Services);
  const tabs: { id: Demo; label: string }[] = [
    { id: "booking", label: "Booking" },
    { id: "pos", label: "POS & Inventory" },
    { id: "assist", label: "AI Assistant" },
  ];

  return <section className="demo-section" id="demo">
    <div className="section-title split-title"><div><span className="eyebrow">PRODUCT DEMONSTRATION</span><h2>See the system work.</h2></div><p>Try three short, realistic workflows. These previews show how separate steps become one clear operating system.</p></div>
    <div className="demo-shell">
      <div className="demo-tabs" role="tablist" aria-label="Product demonstrations">
        {tabs.map(tab => <button key={tab.id} role="tab" aria-selected={demo === tab.id} onClick={() => setDemo(tab.id)}>{tab.label}</button>)}
      </div>
      <AnimatePresence mode="wait">
        <motion.div className="demo-canvas" key={demo} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .24 }}>
          {demo === "booking" && <div className="booking-demo">
            <div className="demo-summary"><span>LIVE BOOKING FLOW</span><h3>{booked ? "Booking confirmed." : "Choose a time that works."}</h3><p>{booked ? "The customer and assigned staff member receive the confirmation automatically." : "Availability updates around the selected service, staff member, and business rules."}</p>{booked && <button className="demo-reset" onClick={() => setBooked(false)}>Start again</button>}</div>
            <div className="booking-panel">
              <div className="mock-bar"><b>Northstar Wellness</b><span>Secure booking</span></div>
              {!booked ? <>
                <div className="booking-select"><label>Service<strong>Signature consultation</strong></label><label>Staff<strong>Maria Santos</strong></label></div>
                <div className="date-row"><button>Tue<br/><b>18</b></button><button className="active">Wed<br/><b>19</b></button><button>Thu<br/><b>20</b></button></div>
                <div className="time-grid">{["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM"].map((time, i) => <button className={i === 1 ? "active" : ""} key={time}>{time}</button>)}</div>
                <div className="deposit-row"><span>Deposit due today</span><b>₱500</b></div>
                <button className="demo-primary" onClick={() => setBooked(true)}>Confirm booking <ChevronRight size={18}/></button>
              </> : <div className="confirmed"><div><Check size={34}/></div><h4>Wednesday, 10:30 AM</h4><p>Signature consultation with Maria Santos</p><span>Reference NS-2048</span></div>}
            </div>
          </div>}

          {demo === "pos" && <div className="pos-demo">
            <div className="pos-stats"><article><span>Today’s sales</span><b>{order ? "₱28,450" : "₱26,950"}</b></article><article><span>Items in stock</span><b>{order ? "1,247" : "1,249"}</b></article><article className="alert"><span>Low stock</span><b>{order ? "4 items" : "3 items"}</b></article></div>
            <div className="pos-grid"><div className="order-card"><span>WEBSITE ORDER</span><h3>Order #1048</h3><div><b>2 × Northstar Blend</b><span>₱1,500</span></div><small>Customer: Ana Reyes</small><button className="demo-primary" onClick={() => setOrder(true)} disabled={order}>{order ? "Order processed" : "Process sale"} <ShoppingCart size={17}/></button></div>
            <div className="activity-card"><span>CONNECTED ACTIVITY</span>{[
              [ShoppingCart, order ? "Sale recorded" : "Website order received", order ? "₱1,500 added to today’s sales" : "Ready for cashier review"],
              [PackageCheck, order ? "Inventory updated" : "Inventory reserved", order ? "2 units removed automatically" : "2 units held for this order"],
              [BellRing, order ? "Low-stock alert created" : "Stock level monitored", order ? "Reorder Northstar Blend" : "5 units available before sale"],
              [UserRound, "Customer record updated", "Order linked to Ana Reyes"],
            ].map(([Icon, title, note], i) => { const ItemIcon = Icon as typeof ShoppingCart; return <div key={i}><ItemIcon size={18}/><p><b>{String(title)}</b><small>{String(note)}</small></p></div>; })}</div></div>
          </div>}

          {demo === "assist" && <div className="assist-demo">
            <div className="assistant-info"><Bot size={30}/><span>CONTROLLED AI ASSISTANCE</span><h3>Useful answers, within clear boundaries.</h3><p>The assistant responds from approved business information and can hand the conversation to a person at any time.</p><ul><li>Approved responses only</li><li>Lead details captured</li><li>Human escalation available</li></ul></div>
            <div className="chat-window"><div className="chat-head"><div><i/><b>Northstar Assistant</b></div><span>Online</span></div><div className="chat-body"><p className="bot-message">Hi! How can I help today?</p><p className="bot-message">{reply}</p></div><div className="quick-options">{Object.keys(aiReplies).map(option => <button key={option} onClick={() => setReply(aiReplies[option])}>{option}</button>)}</div></div>
          </div>}
        </motion.div>
      </AnimatePresence>
    </div>
  </section>;
}

export function IndustrySelector() {
  const [active, setActive] = useState(0);
  const industry = industries[active];
  return <section className="industry-selector" id="industries">
    <div className="section-title split-title"><div><span className="eyebrow">BUILT AROUND YOUR BUSINESS</span><h2>Choose your industry.</h2></div><p>The tools change. The goal does not: a clearer customer journey and a system your team can confidently run.</p></div>
    <div className="industry-interface">
      <div className="industry-tabs" role="tablist" aria-label="Industries">
        {industries.map((item, i) => <button key={item.name} role="tab" aria-selected={active === i} onClick={() => setActive(i)}><span>0{i + 1}</span>{item.short}<ChevronRight size={18}/></button>)}
      </div>
      <AnimatePresence mode="wait"><motion.div key={industry.name} className="industry-panel" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
        <span>RECOMMENDED CAPABILITIES</span><h3>{industry.name}</h3><p>{industry.note}</p><div>{industry.features.map(feature => <article key={feature}><Check size={17}/><b>{feature}</b></article>)}</div>
      </motion.div></AnimatePresence>
    </div>
  </section>;
}
