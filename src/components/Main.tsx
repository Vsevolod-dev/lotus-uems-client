import React, {FC, useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";

const timeToNormalView = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds - hours * 3600) / 60)
    seconds = seconds - hours * 3600 - minutes * 60
    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}
const isJson = (str: any) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
const Main: FC = () => {
    const socket = useRef<WebSocket>()
    const params = useParams()
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('')
    const timerRef = useRef<HTMLTableHeaderCellElement>(null);
    const [ended, setEnded] = useState(false);

    const connect = (e: React.MouseEvent) => {
        e.preventDefault()
        socket.current = new WebSocket('ws://134.0.118.142:5000')
        socket.current.onopen = () => {
            setConnected(true)

            const message = {
                event: 'connection',
                username,
                id: params.id
            }
            if (!socket.current) return

            socket.current.send(JSON.stringify(message))
        }
        socket.current.onmessage = (event) => {
            if (!isJson(event.data) || !timerRef.current) return;
            const message = JSON.parse(event.data)
            switch (message.event) {
                case 'time':
                    if (message.message === 0) setEnded(true)
                    timerRef.current.innerHTML = timeToNormalView(message.message)
                    break
                case 'transfers-end':
                    setEnded(true)
                    timerRef.current.innerHTML = timeToNormalView(0)
                    break
                default:
                    break
            }
        }
        socket.current.onclose = () => {
            console.log('Socket закрыт')
        }
        socket.current.onerror = () => {
            console.log('Socket произошла ошибка')
        }
    }

    return (
        !connected
            ?
            <form className="login-form">
                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    type="text"
                    placeholder="Введите ваше имя"/>
                <button onClick={connect}>Войти</button>
            </form>
            :
            <div className={'transfers'}>
                <h1 className={"transfers__title"}><span>Ход торгов</span> <b>Тестовое торги на аппарат ЛОТОС №2033564
                    (09.11.2022) 07:00</b></h1>
                <h2 className={'transfers__username'}><span>Ваше имя:</span> {username}</h2>
                <hr/>
                <p className={'transfers__text'}>Уважаемые участники торгов, во время вашего хода вы можете изменить
                    параметры торгов, указанных в
                    таблице:</p>
                <table className={'transfers__table'}>
                    <thead>
                        <tr>
                            <th>ХОД</th>
                            <th className={'timer'} ref={timerRef}>Загрузка...</th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>ПАРАМЕТРЫ И ТРЕБОВАНИЯ</th>
                            <th>Участник 1</th>
                            <th>Участник 2</th>
                            <th>Участник 3</th>
                            <th>Участник 4</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Параметр 1</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>Параметр 2</td>
                            <td>80</td>
                            <td>90</td>
                            <td>75</td>
                            <td>120</td>
                        </tr>
                        <tr>
                            <td>Параметр 3</td>
                            <td>24</td>
                            <td>24</td>
                            <td>32</td>
                            <td>36</td>
                        </tr>
                        <tr>
                            <td>Параметр 4</td>
                            <td>30%</td>
                            <td>100%</td>
                            <td>60%</td>
                            <td>50%</td>
                        </tr>
                    </tbody>
                </table>
                {ended && <p className="transfers__text">Торги закончились</p>}
            </div>
    );
};

export default Main;
