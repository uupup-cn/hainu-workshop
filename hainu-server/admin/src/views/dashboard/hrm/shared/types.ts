export interface StatCard {
  title: string
  value: string
  change: string
  changeIcon: string
  changeClass: string
  icon: string
  iconClass: string
}

export interface EmployeeStatusSegment {
  label: string
  percent: string
  color: string
}

export interface EmployeeStatusItem {
  label: string
  value: string
  color: string
}

export interface CandidateChartSeries {
  name: string
  data: number[]
}

export interface AttendanceLegendItem {
  label: string
  value: string
  color: string
}

export interface EmployeeRow {
  name: string
  role: string
  department: string
  date: string
  tagClass: string
  avatar: string
}

export interface TodayAttendanceRow {
  name: string
  role: string
  time: string
  status: string
  statusClass: string
  avatar: string
}

export interface ApplicantRow {
  id: string
  name: string
  position: string
  date: string
  email: string
  experience: string
  status: string
  statusClass: string
  avatar: string
}
