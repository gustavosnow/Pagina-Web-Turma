import { useEffect, useState } from "react";
import { BootScreen } from "./components/BootScreen";
import { Hud } from "./components/Hud";
import { Hero } from "./components/Hero";
import { Jornada } from "./components/Jornada";
import { Docente } from "./components/Docente";
import { SelecaoJogador } from "./components/SelecaoJogador";
import { Mestres } from "./components/Mestres";
import { Mundos } from "./components/Mundos";
import { Continue } from "./components/Continue";
import { iniciarRolagem, pausarRolagem } from "./lib/rolagem";
import { reduzirMovimento, ScrollTrigger } from "./lib/movimento";

export function App() {
  // Com "reduzir movimento" a tela de boot é pulada
  const [iniciado, setIniciado] = useState(reduzirMovimento);

  useEffect(() => iniciarRolagem(), []);

  useEffect(() => {
    pausarRolagem(!iniciado);
    // Enquanto o boot está na tela, o resto da página fica fora do alcance do teclado e do leitor de tela
    document.querySelectorAll<HTMLElement>("#conteudo, .hud").forEach((el) => (el.inert = !iniciado));
    if (iniciado) ScrollTrigger.refresh();
  }, [iniciado]);

  return (
    <>
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>
      {!iniciado && <BootScreen aoIniciar={() => setIniciado(true)} />}
      <Hud />
      <main id="conteudo">
        <Hero iniciado={iniciado} />
        <Jornada />
        <Docente />
        <SelecaoJogador />
        <Mestres />
        <Mundos />
        <Continue />
      </main>
      <div className="crt" aria-hidden="true" />
    </>
  );
}
