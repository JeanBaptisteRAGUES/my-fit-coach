import React, { Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiShoppingCart } from 'react-icons/hi';
import './test-component.css';

const TestComponent = () => {


    return (
        <div className='container-sport h-screenMinusHeader'>
            <div className='flex flex-row justify-center font-bold text-2xl items-center fixed top-[5vh] z-10 w-full h-screen backdrop-blur-md bg-slate-900/50 motion-safe:animate-fall'>
                <div className=' w-1/2 h-fit bg-sky-300 max-h-[50%] overflow-y-auto col-start-3 col-span-4 row-start-2'>
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
        </div>
    )
}

export default TestComponent;
