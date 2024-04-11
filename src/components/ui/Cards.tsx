import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faImage } from '@fortawesome/free-regular-svg-icons';
import { faHouse, faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import iconeFechar from '../../../public/images/icone-fechar.svg';
import Image from 'next/image';

const Card = ({ setOpenModal }) => {
  const arrayCards = [
    {
      titulo: 'Home',
      icone: (
        <FontAwesomeIcon icon={faHouse} size="2xl" style={{color: "#FFD43B",}} />
      ),
    },
    {
      titulo: 'Capturar foto',
      icone: (
        <FontAwesomeIcon icon={faImage} size="2xl" style={{color: "#63E6BE",}} />
      ),
    },
    {
      titulo: 'Taxas',
      icone: (
        <FontAwesomeIcon
          icon={faCreditCard}
          size="2xl"
          style={{ color: '#094dec' }}
        />
      ),
    },
    {
      titulo: 'Pagamentos',
      icone: (
        <FontAwesomeIcon
          icon={faCreditCard}
          size="2xl"
          style={{ color: '#094dec' }}
        />
      ),
    },
    {
      titulo: 'Cashback',
      icone: (
        <FontAwesomeIcon
          icon={faCreditCard}
          size="2xl"
          style={{ color: '#094dec' }}
        />
      ),
    },
    {
      titulo: 'Bancos próximos',
      icone: (
        <FontAwesomeIcon
          icon={faCreditCard}
          size="2xl"
          style={{ color: '#094dec' }}
        />
      ),
    },
    {
      titulo: 'Título 7',
      icone: (
        <FontAwesomeIcon
          icon={faCreditCard}
          size="2xl"
          style={{ color: '#094dec' }}
        />
      ),
    },
    {
      titulo: 'Título 8',
      icone: (
        <FontAwesomeIcon
          icon={faCreditCard}
          size="2xl"
          style={{ color: '#094dec' }}
        />
      ),
    },
    {
      titulo: 'Título 9',
      icone: (
        <FontAwesomeIcon
          icon={faCreditCard}
          size="2xl"
          style={{ color: '#094dec' }}
        />
      ),
    },
  ];

  const [quantidade, setQuantidade] = React.useState(9);

  return (
    <div className="bg-[#F8F9FA] p-5 rounded-xl flex flex-col w-[440px] absolute right-2">
      <button
        className="self-end cursor-pointer mb-3"
        onClick={() => setOpenModal(false)}
      >
        <Image
          src={iconeFechar}
          width={24}
          height={24}
          alt=""
        />
      </button>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-black font-semibold text-xl">Services</h2>
        <button
          className="text-zinc-600 cursor-pointer hover:underline"
          onClick={() => setQuantidade(arrayCards.length)}
        >
          {arrayCards.length - quantidade > 0
            ? `+ ${arrayCards.length - quantidade} other services`
            : ''}
        </button>
      </div>

      <div className="flex flex-wrap gap-5 max-w-[400px] justify-center">
        {arrayCards.slice(0, quantidade).map((card) => (
          <div
            key={card.titulo}
            className="w-[120px] text-center p-5 rounded-lg flex flex-col justify-center items-center gap-2 text-[12px] text-black bg-white cursor-pointer"
          >
            {card.icone}
            <p>{card.titulo}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
