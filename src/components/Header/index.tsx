import styles from './styles.module.scss';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

export default function Header() {
    const dataDeHoje = format(new Date(), 'EEEEEE, d MMMM', { locale: ptBR });

    return (
        <header className={styles.headerContainer}>
            <img src="/logo.svg" />
            <p>O melhor para voce ouvir sempre</p>
            <span>{dataDeHoje}</span>
        </header>
    );
}