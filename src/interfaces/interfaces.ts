export interface IAppointment {
  customerName: string;
  email: string;
  phone: string; // Novo campo adicionado
  date: string; // Mantendo como string para facilitar o manuseio no formulário
  time: string;
  service: string;
  artist: string;
  notes?: string;
}
