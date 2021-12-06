import React from 'react'
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div>
            <p>Page introuvable :-/</p>
            <Link to='/'>Retour à l'accueil</Link>
        </div>
    )
}

export default ErrorPage;
