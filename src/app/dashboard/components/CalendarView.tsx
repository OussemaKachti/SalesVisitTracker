'use client';

import { useState, useEffect } from 'react';
import Icon from '../../../components/ui/AppIcon';

// --- Interfaces ---
interface Appointment {
  id: string;
  visite_id: string;
  date_rdv: string;
  heure_rdv: string;
  objet: string;
  commercial_id: string;
  commercial_name: string;
  entreprise: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  description?: string;
  location?: string;
  attendees?: string[];
  commercial_name?: string;
  objet?: string;
  personne_contact?: string;
  telephone?: string;
  priorite?: string;
  duree?: number;
}

interface CalendarViewProps {
  currentUserRole: 'commercial' | 'admin' | 'consultant' | null;
  currentUserId: string | null;
}

type ViewType = 'month' | 'week' | 'day';

// --- Constants & Modern Palette ---
const COMMERCIAL_COLORS = [
  '#4F46E5', // Indigo-600 (Primary)
  '#0EA5E9', // Sky-500 (Clean Blue)
  '#10B981', // Emerald-500 (Success)
  '#F59E0B', // Amber-500 (Warning)
  '#EC4899', // Pink-500 (Accent)
  '#8B5CF6', // Violet-500 (Royal)
  '#64748B', // Slate-500 (Neutral)
];

const MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const DAY_NAMES_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 07:00 to 19:00

export default function CalendarView({ currentUserRole, currentUserId }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Interaction states
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    fetchAppointments();
  }, [currentDate, view]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      let start = new Date(year, month - 1, 1);
      let end = new Date(year, month + 2, 0);

      if (view === 'week') {
           const day = currentDate.getDay();
           const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
           start = new Date(currentDate);
           start.setDate(diff);
           end = new Date(currentDate);
           end.setDate(diff + 6);
      }

      // Simplified fetch for demo - real impl would use API
      const response = await fetch(`/api/rendez-vous?from=${start.toISOString()}&to=${end.toISOString()}`);
      
      let rdvList = [];
      if (response.ok) {
        const data = await response.json();
        rdvList = data.data || [];
      }

      // Fetch all team profiles once to get commercial names
      let allProfiles: any[] = [];
      try {
        const equipeRes = await fetch('/api/equipe');
        if (equipeRes.ok) {
          const equipeData = await equipeRes.json();
          allProfiles = equipeData.data || [];
        }
      } catch (e) {
        console.error('Error fetching team profiles:', e);
      }

      // Enrich & Map to CalendarEvent - Use RDV data directly
      const mappedEvents: CalendarEvent[] = rdvList.map((rdv: any) => {
        // Find commercial in profiles list
        let commercialName = 'Commercial';
        if (rdv.commercial_id && allProfiles.length > 0) {
          const profile = allProfiles.find((p: any) => p.id === rdv.commercial_id);
          if (profile) {
            commercialName = `${profile.prenom || ''} ${profile.nom || ''}`.trim() || profile.email || 'Commercial';
          }
        }

        // Use RDV's own data
        const company = rdv.entreprise || 'Client';
        const object = rdv.objet || 'Rendez-vous';
        const description = rdv.description || '';
        const location = rdv.adresse || rdv.ville || '';
        const contact = rdv.personne_contact || '';
        const phone = rdv.telephone || '';
        const priority = rdv.priorite || 'normale';
        const duration = rdv.duree_estimee || 60;
        
        const charCodeSum = (company || 'A').split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        const color = COMMERCIAL_COLORS[charCodeSum % COMMERCIAL_COLORS.length];

        // Parse date_rdv which already contains time (e.g., "2026-01-23 13:00:00+00")
        const startDate = new Date(rdv.date_rdv);
        const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

        return {
          id: rdv.id,
          title: company,
          start: startDate,
          end: endDate,
          color: color,
          description: description,
          objet: object,
          location: location,
          commercial_name: commercialName,
          personne_contact: contact,
          telephone: phone,
          priorite: priority,
          duree: duration
        };
      });

      setEvents(mappedEvents);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- Helpers ---
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getWeekDays = (date: Date) => {
    const curr = new Date(date);
    const week = [];
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1); 
    
    const monday = new Date(curr);
    monday.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
        const next = new Date(monday);
        next.setDate(monday.getDate() + i);
        week.push(next);
    }
    return week;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return events
      .filter(e => e.start >= today)
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 5);
  };

  const handleEventMouseEnter = (event: CalendarEvent, e: React.MouseEvent) => {
    setHoveredEvent(event.id);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top - 8 });
  };

  const navigateDate = (direction: 'prev' | 'next' | 'today') => {
    const newDate = new Date(currentDate);
    if (direction === 'today') {
        setCurrentDate(new Date());
        return;
    }
    
    const step = direction === 'next' ? 1 : -1;
    
    if (view === 'month') {
        newDate.setMonth(newDate.getMonth() + step);
    } else if (view === 'week') {
        newDate.setDate(newDate.getDate() + (step * 7));
    } else {
        newDate.setDate(newDate.getDate() + step);
    }
    setCurrentDate(newDate);
  };

  // --- Renderers ---
  const renderMonthView = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const days = [];
    
    // Empty slots
    for (let i = 0; i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1); i++) {
        days.push(<div key={`empty-${i}`} className="min-h-[100px] bg-slate-50/30 border-b border-r border-slate-100/80" />);
    }
    
    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayEvents = getEventsForDate(date);
        const isToday = new Date().toDateString() === date.toDateString();
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
        days.push(
            <div
                key={day}
                className={`
                    relative min-h-[100px] p-1 border-b border-r border-slate-200 group transition-colors duration-200 cursor-pointer
                    ${isToday ? 'bg-white' : 'bg-white hover:bg-slate-50'}
                `}
            >
                <div className="flex justify-center items-center mb-1 mt-1">
                    <span className={`
                        text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center
                        ${isToday ? 'bg-[#1a73e8] text-white' : isWeekend ? 'text-slate-400' : 'text-slate-700'}
                    `}>
                        {day}
                    </span>
                </div>

                <div className="flex flex-col gap-1">
                    {dayEvents.slice(0, 3).map(event => (
                        <button
                            key={event.id}
                            onMouseEnter={(e) => handleEventMouseEnter(event, e)}
                            onMouseLeave={() => { setHoveredEvent(null); setTooltipPosition(null); }}
                            className="text-left w-full group/event relative px-2 py-0.5 rounded text-[11px] font-medium truncate transition-all hover:brightness-95 hover:shadow-sm"
                            style={{ backgroundColor: event.color, color: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                        >
                            <span className="truncate">{event.title}</span>
                        </button>
                    ))}
                    {dayEvents.length > 3 && (
                        <div className="text-[10px] text-slate-400 font-medium px-1 hover:text-slate-600 cursor-pointer pt-0.5">+{dayEvents.length - 3} autres...</div>
                    )}
                </div>
            </div>
        );
    }
    return days;
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    const today = new Date();

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Week Header */}
            <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50/50">
                <div className="w-14 border-r border-slate-100"></div> {/* Time Col Header */}
                {weekDays.map((date, i) => {
                    const isToday = date.toDateString() === today.toDateString();
                    return (
                        <div key={i} className={`py-3 text-center border-r border-slate-100 ${isToday ? 'bg-blue-50/30' : ''}`}>
                            <div className={`text-[11px] font-bold uppercase mb-1 ${isToday ? 'text-[#1a73e8]' : 'text-slate-400'}`}>
                                {DAY_NAMES_FR[date.getDay()]}
                            </div>
                            <div className={`text-xl font-bold ${isToday ? 'text-[#1a73e8]' : 'text-slate-700'}`}>
                                {date.getDate()}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Time Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                <div className="grid grid-cols-8 min-h-[600px]">
                    
                    {/* Time Labels Column */}
                    <div className="w-14 bg-white border-r border-slate-100 z-10 sticky left-0">
                        {HOURS.map(hour => (
                            <div key={hour} className="h-20 border-b border-transparent relative">
                                <span className="absolute -top-2.5 right-2 text-xs text-slate-400 font-medium">
                                    {hour}:00
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Days Columns */}
                    {weekDays.map((date, i) => {
                        const dayEvents = getEventsForDate(date);
                        const isToday = date.toDateString() === today.toDateString();
                        
                        return (
                            <div key={i} className={`relative border-r border-slate-100 ${isToday ? 'bg-blue-50/10' : ''}`}>
                                {/* Hour Lines */}
                                {HOURS.map(hour => (
                                    <div key={hour} className="h-20 border-b border-slate-100/60" />
                                ))}
                                
                                {/* Current Time Indicator (if Today) */}
                                {isToday && (
                                    <div 
                                        className="absolute w-full border-t-2 border-[#ea4335] z-20 pointer-events-none"
                                        style={{ top: `${((today.getHours() - 7) * 80) + ((today.getMinutes() / 60) * 80)}px` }}
                                    >
                                        <div className="w-2 h-2 bg-[#ea4335] rounded-full -mt-1 -ml-1 text-[8px] text-white flex items-center justify-center" />
                                    </div>
                                )}

                                {/* Events */}
                                {dayEvents.map(event => {
                                    const startHour = event.start.getHours();
                                    const startMin = event.start.getMinutes();
                                    const top = ((startHour - 7) * 80) + ((startMin / 60) * 80);
                                    const height = 80; // Default 1h for now

                                    return (
                                        <div
                                            key={event.id}
                                            onMouseEnter={(e) => handleEventMouseEnter(event, e)}
                                            onMouseLeave={() => { setHoveredEvent(null); setTooltipPosition(null); }}
                                            className="absolute left-1 right-1 rounded px-2 py-1 shadow-sm text-xs cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all z-10 overflow-hidden border border-white/20"
                                            style={{
                                                top: `${top}px`,
                                                height: `${height}px`,
                                                backgroundColor: event.color,
                                                color: '#fff'
                                            }}
                                        >
                                            <div className="font-bold truncate text-[10px] leading-tight">{event.title}</div>
                                            <div className="text-[9px] opacity-90 leading-tight">
                                                {event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
  };

  const hoveredEventData = hoveredEvent ? events.find(e => e.id === hoveredEvent) : null;
  const upcomingList = getUpcomingEvents();

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8 font-sans items-start">
      
      {/* 1. Left Sidebar: Mini Calendar */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 pt-1">
        
        

        {/* Mini Calendar Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 w-full max-w-[320px]">
            <div className="flex items-center justify-between mb-4 pl-2">
                <h4 className="font-bold text-slate-900 text-sm">
                    {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h4>
                <div className="flex gap-2">
                     <button onClick={() => navigateDate('prev')} className="p-1 hover:bg-slate-100 rounded-full text-slate-500"><Icon name="ChevronLeftIcon" size={14} /></button>
                     <button onClick={() => navigateDate('next')} className="p-1 hover:bg-slate-100 rounded-full text-slate-500"><Icon name="ChevronRightIcon" size={14} /></button>
                </div>
            </div>
            
            <div className="grid grid-cols-7 mb-2">
                 {['L','M','M','J','V','S','D'].map(d => (
                    <div key={d} className="text-center text-[10px] text-slate-500 font-medium py-1">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
                 {Array.from({ length: (new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() + 6) % 7 }).map((_, i) => (
                     <div key={`empty-${i}`} />
                 ))}
                 
                 {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                     const dayNum = i + 1;
                     const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
                     const isSelected = dayNum === currentDate.getDate();
                     const hasEvents = getEventsForDate(currentDayDate).length > 0;
                     
                     return (
                        <div key={dayNum} className="flex items-center justify-center h-8 w-8">
                             <button 
                                onClick={() => {
                                    const newDate = new Date(currentDate);
                                    newDate.setDate(dayNum);
                                    setCurrentDate(newDate);
                                }}
                                className={`
                                    w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all
                                    ${isSelected 
                                        ? 'bg-[#1a73e8] text-white shadow-sm' 
                                        : 'text-slate-700 hover:bg-slate-100'
                                    }
                                    ${hasEvents && !isSelected ? 'ring-1 ring-emerald-500 text-emerald-700 font-bold bg-emerald-50' : ''}
                                `}
                             >
                                 {dayNum}
                             </button>
                        </div>
                     );
                 })}
            </div>
        </div>
      </div>

      {/* 2. Right: Agenda Card */}
      <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-2.5 rounded-xl shadow-lg shadow-blue-200">
                        <Icon name="CalendarDaysIcon" size={22} />
                    </div>
                    <div>
                        <h5 className="font-bold text-slate-900 text-lg">Agenda & Priorités</h5>
                        <p className="text-xs text-slate-500">Vos prochains rendez-vous importants</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100">
                        {upcomingList.length} à venir
                    </span>
                </div>
            </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-slate-50/30">
            {upcomingList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 py-12">
                    <div className="bg-slate-100 p-4 rounded-full">
                        <Icon name="CalendarIcon" size={32} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-medium">Aucun rendez-vous planifié</p>
                    <p className="text-xs text-slate-400">Vos prochains événements apparaîtront ici</p>
                </div>
            ) : (
                upcomingList.map((event, index) => {
                    const isToday = new Date().toDateString() === event.start.toDateString();
                    const isTomorrow = new Date(Date.now() + 86400000).toDateString() === event.start.toDateString();
                    
                    return (
                        <div 
                            key={event.id} 
                            className={`
                                bg-white rounded-xl border transition-all cursor-pointer group
                                ${isToday 
                                    ? 'border-blue-200 shadow-md shadow-blue-100 ring-1 ring-blue-100' 
                                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                                }
                            `}
                        >
                            {/* Card Header */}
                            <div className="px-4 py-3 flex items-center gap-4">
                                {/* Date Block */}
                                <div className={`
                                    flex flex-col items-center justify-center min-w-[4rem] py-2 px-3 rounded-xl
                                    ${isToday 
                                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200' 
                                        : isTomorrow 
                                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-200'
                                            : 'bg-slate-100 text-slate-700'
                                    }
                                `}>
                                    <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">
                                        {isToday ? "Auj." : isTomorrow ? "Demain" : event.start.toLocaleDateString('fr-FR', {weekday: 'short'}).replace('.','')}
                                    </span>
                                    <span className="text-2xl font-black leading-none">
                                        {event.start.getDate()}
                                    </span>
                                    <span className="text-[10px] font-medium opacity-70 uppercase">
                                        {event.start.toLocaleDateString('fr-FR', {month: 'short'}).replace('.','')}
                                    </span>
                                </div>
                                
                                {/* Color Bar */}
                                <div 
                                    className="w-1 self-stretch rounded-full my-1" 
                                    style={{ backgroundColor: event.color }} 
                                />
                                
                                {/* Main Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className={`
                                            text-xs font-bold px-2 py-0.5 rounded-md
                                            ${isToday ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}
                                        `}>
                                            <Icon name="ClockIcon" size={10} className="inline mr-1" />
                                            {event.start.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                                            {' - '}
                                            {event.end.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                        {isToday && (
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full animate-pulse">
                                                AUJOURD'HUI
                                            </span>
                                        )}
                                        {/* Priority Badge */}
                                        {event.priorite && (
                                            <span className={`
                                                text-[10px] font-bold px-2 py-0.5 rounded-full
                                                ${event.priorite === 'haute' ? 'bg-red-100 text-red-600' : 
                                                  event.priorite === 'moyenne' ? 'bg-amber-100 text-amber-600' : 
                                                  'bg-green-100 text-green-600'}
                                            `}>
                                                {event.priorite.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <h4 className="text-base font-bold text-slate-900 truncate mb-1">
                                        {event.title}
                                    </h4>
                                    
                                    <p className="text-xs text-slate-500 truncate">
                                        <span className="font-medium text-slate-600">Objet:</span> {event.objet || event.description || 'Rendez-vous commercial'}
                                    </p>
                                </div>
                                
                                {/* Action Arrow */}
                                <div className="self-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                                    <Icon name="ChevronRightIcon" size={20} className="text-slate-400" />
                                </div>
                            </div>
                            
                            {/* Card Footer - Details */}
                            <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 rounded-b-xl">
                                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                                    {/* Commercial */}
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                            <Icon name="UserIcon" size={12} className="text-blue-600" />
                                        </div>
                                        <span className="font-medium text-slate-700">{event.commercial_name || 'Non assigné'}</span>
                                    </div>
                                    
                                    {/* Separator */}
                                    <div className="w-px h-4 bg-slate-200"></div>
                                    
                                    {/* Contact Person */}
                                    {event.personne_contact && (
                                        <>
                                            <div className="flex items-center gap-1.5">
                                                <Icon name="IdentificationIcon" size={14} className="text-slate-400" />
                                                <span className="font-medium">{event.personne_contact}</span>
                                            </div>
                                            <div className="w-px h-4 bg-slate-200"></div>
                                        </>
                                    )}
                                    
                                    {/* Phone */}
                                    {event.telephone && (
                                        <>
                                            <div className="flex items-center gap-1.5">
                                                <Icon name="PhoneIcon" size={14} className="text-emerald-500" />
                                                <span>{event.telephone}</span>
                                            </div>
                                            <div className="w-px h-4 bg-slate-200"></div>
                                        </>
                                    )}
                                    
                                    {/* Location */}
                                    {event.location ? (
                                        <div className="flex items-center gap-1.5">
                                            <Icon name="MapPinIcon" size={14} className="text-rose-400" />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Icon name="MapPinIcon" size={14} />
                                            <span className="italic">Lieu non défini</span>
                                        </div>
                                    )}
                                    
                                    {/* Separator */}
                                    <div className="w-px h-4 bg-slate-200"></div>
                                    
                                    {/* Duration */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <Icon name="ClockIcon" size={14} className="text-slate-400" />
                                        <span>{event.duree ? `${event.duree}min` : '1h'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredEventData && tooltipPosition && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)' 
          }}
        >
          <div className="mb-2 bg-slate-900/95 backdrop-blur-md text-white shadow-2xl rounded-2xl p-4 w-64 border border-slate-700/50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: hoveredEventData.color }} />
                <div>
                    <h4 className="font-bold text-sm leading-tight">{hoveredEventData.title}</h4>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Icon name="ClockIcon" size={10} />
                        {hoveredEventData.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {hoveredEventData.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs text-slate-300">
                    <Icon name="UserIcon" size={14} className="mt-0.5 text-slate-500" />
                    <span>{hoveredEventData.commercial_name}</span>
                </div>
                {hoveredEventData.location && (
                    <div className="flex items-start gap-2 text-xs text-slate-300">
                         <Icon name="MapPinIcon" size={14} className="mt-0.5 text-slate-500" />
                        <span>{hoveredEventData.location}</span>
                    </div>
                )}
            </div>
          </div>
          <div className="w-4 h-4 bg-slate-900/95 rotate-45 transform origin-center mx-auto -mt-3.5 rounded-sm border-r border-b border-slate-700/50" />
        </div>
      )}
    </div>
  );
}
