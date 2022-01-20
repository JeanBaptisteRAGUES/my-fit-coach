import React, { Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiShoppingCart } from 'react-icons/hi';
import './test-component.css';

const TestComponent = () => {
    /*
    const navigate = useNavigate();
    const location = useLocation();
    let {user} = location.state;
    user = JSON.parse(user);
    */

    /*
    const loadSessionMenu = () => {
        const myState = {userID: user.id};
        navigate('/session-menu', {state: myState});
    }
    */


    return (
        <div className='w-full h-screenMinusHeader grid grid-cols-6 grid-rows-6 bg-nutrition overflow-x-hidden'>
            <div className='flexCenter fixed top-header2 w-full text-white col-start-1 col-span-6'>
                <HiShoppingCart className='flexCenter p-1 cursor-pointer h-1/3 w-1/6 bg-slate-600' >

                </HiShoppingCart>
            </div>
            <div className=' w-1/2 h-fit bg-sky-300 col-start-3 col-span-4 row-start-2'>
                <p>
                    Google Translate est basé sur une méthode appelée traduction automatique statistique4, et plus spécifiquement, sur les recherches de Franz-Josef Och qui a remporté le concours DARPA pour la vitesse de traduction automatique en 2003. Och est maintenant chargé du département de traduction automatique de Google.
                    Selon Och5, une base solide pour l'élaboration d'une statistique utilisable consisterait à avoir un corpus de textes (ou texte parallèle) bilingue de plus d'un million de mots et deux corpus unilingues de plus d'un milliard de mots chacun. Les modèles statistiques à partir de ces données servent ensuite à traduire les différentes langues.
                    Pour acquérir cette énorme quantité de données linguistiques, Google utilise les documents correspondants de l'Organisation des Nations unies4. Le même document est normalement disponible dans les six langues officielles de l'ONU, ce qui permet maintenant à Google hectalingual d'avoir un corpus de 20 milliards de mots.
                    La disponibilité de l'arabe et du chinois comme langues officielles de l'ONU est probablement une des raisons pour lesquelles Google Translate a d'abord concentré ses efforts sur le développement de la traduction entre l'anglais et les autres langues, et non pas, par exemple, sur le japonais ou l'allemand, qui ne sont pas des langues officielles de l'ONU.
                    Les représentants de Google ont été très actifs à des conférences nationales au Japon et ont persuadé des chercheurs de leur fournir des corpus bilingues. Google a été un commanditaire officiel de la Computational Linguistics annuel à la conférence Gengoshorigakkai au Japon en 2007. Google a également envoyé un délégué à la réunion des membres de la Société de linguistique informatique du Japon en mars 2005.
                    Depuis 2016, Google Translate utilise un réseau de neurones récurrents comme langue intermédiaire pour éviter de passer par l'anglais6.
                </p>
            </div>
        </div>
    )
}

export default TestComponent;
