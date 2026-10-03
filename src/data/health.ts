export type HealthCondition = { label: string; icon: string; background: string };

export const healthConditions: HealthCondition[] = [
  { label: 'Diyabet', icon: '●', background: '#FFF0F0' }, { label: 'Çölyak', icon: '✦', background: '#FFF8E8' },
  { label: 'Hipertansiyon', icon: '♥', background: '#FFF0F2' }, { label: 'Laktoz intoleransı', icon: '▯', background: '#ECF6FF' },
  { label: 'Süt alerjisi', icon: '◆', background: '#FFF8E5' }, { label: 'Fındık/fıstık alerjisi', icon: '●', background: '#F9F0E7' },
  { label: 'Böbrek hastalığı', icon: '◉', background: '#FFF0F2' }, { label: 'Fenilketonüri', icon: '⌘', background: '#EDF6FF' },
  { label: 'İrritabl bağırsak sendromu (IBS)', icon: '◌', background: '#F4F0FF' },
];
