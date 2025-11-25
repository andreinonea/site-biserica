import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import Logo from "../components/Logo";



const Footer = () => {
  return (<div>
    <div className="bg-[#0b0a24] backdrop-blur-xl  bg-gradient-to-b z-5 relative ">
      <div className="flex place-content-center py-5">
        <Image
          src="/logo_negru_1.webp"
          className="invert-100 select-none"
          alt="logo"
          width={150}
          height={80}
        />
      </div>
      <div className="max-w-3xl mx-auto flex md:flex-row flex-col gap-10 px-10">
        <div className="flex justify-start items-center gap-4">

          <img src="./icons/phone.svg" alt="Phone" className="w-7 h-7 mt-1" />
          <div>
            <p className="text-lg font-medium text-white/90">Telefon</p>
            <a
              href="tel:+40712345678"
              className="text-white/70 hover:underline"
            >
              Preoți slujitori
             Sorin Petre Georgescu 
             Constantin Sandu
             Gheorghe Oprea
            </a>
          </div>
        </div>

        <div className="flex justify-start items-center gap-4">
          <img src="./icons/map.svg" alt="map pin" className="w-7 h-7 mt-1" />
          <div>
            <p className="text-lg font-medium text-white/90">Adresă</p>
            <p className="text-white/70">
              Strada Foișorului Nr. 119, București
            </p>
            <a
              href="https://www.google.com/maps/place/Strada+Foișorului+119,+București"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#c95d43] hover:underline"
            >
              Vezi pe Google Maps
            </a>
          </div>
        </div>

        <div className="flex  justify-start items-center gap-4">
          <img src="./icons/mail.svg" alt="email" className="w-7 h-7 mt-1" />
          <div>
            <p className="text-lg font-medium text-white/90">Email</p>
            <a
              href="mailto:contact@biserica.ro"
              className="text-white/70 hover:underline"
            >
              bisericafoisor@gmail.ro
            </a>
          </div>
        </div>
      </div>

      <Logo theme='light'/>

    </div>

  </div>);
};

export default Footer;
