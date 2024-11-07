import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';


export const formatDatePublishToString = (publish: string): string => {
    //convertendo formato da data de publicacao
    const newPublish = format(parseISO(publish), 'd MMM yy', { locale: ptBR });

    return newPublish;
}

export const convertDurationToTimeString = (duration: number): string => {

    //transformando durancao em horas, minutos e segundos
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    //formatando a hora
    const timeString = [hours, minutes, seconds].map(unit => String(unit).padStart(2, '0')).join(':');

    return timeString;
}