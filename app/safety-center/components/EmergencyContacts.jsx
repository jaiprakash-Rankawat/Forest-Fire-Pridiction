"use client";

import React from "react";
import { FaPhoneAlt, FaAmbulance, FaFireExtinguisher, FaTree } from "react-icons/fa";

export default function EmergencyContacts() {
  const contacts = [
    { name: "National Fire Service", number: "101", icon: <FaFireExtinguisher />, color: "bg-red-500", text: "text-red-600" },
    { name: "Forest Department Hotline", number: "1800-425-1111", icon: <FaTree />, color: "bg-green-600", text: "text-green-700" },
    { name: "Disaster Management", number: "108", icon: <FaAmbulance />, color: "bg-orange-500", text: "text-orange-600" },
    { name: "Local Police", number: "100", icon: <FaPhoneAlt />, color: "bg-blue-600", text: "text-blue-700" }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200 p-4">
        <h3 className="text-gray-800 font-bold text-xl flex items-center">
          <span className="text-2xl mr-2">📞</span> Emergency Contacts
        </h3>
      </div>
      
      <div className="p-6 flex-1 flex flex-col justify-center gap-4">
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className={`w-12 h-12 ${contact.color} text-white rounded-full flex items-center justify-center text-xl shadow-md mr-4`}>
                {contact.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{contact.name}</h4>
                <p className="text-sm text-gray-500">Available 24/7</p>
              </div>
            </div>
            <a href={`tel:${contact.number}`} className={`font-black text-xl md:text-2xl ${contact.text} hover:scale-105 transition-transform`}>
              {contact.number}
            </a>
          </div>
        ))}
      </div>
      <div className="bg-yellow-50 p-4 border-t border-yellow-100 text-center">
        <p className="text-sm font-semibold text-yellow-800">Only call in case of genuine emergencies.</p>
      </div>
    </div>
  );
}
