import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto px-4 py-8 gap-8">
        {/* Left Column */}
        <div className="flex-1 flex flex-col items-center lg:items-start justify-center space-y-8 px-4">
       
          {/* Title with red underline */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-2">
              Cas@Event | Bienvenue
            </h1>
            <div className="w-full h-1 bg-custom-orange"></div>
          </div>

          {/* Descriptive text */}
          <p className="text-lg text-muted-foreground text-center lg:text-left max-w-md leading-relaxed">
            Cas@Event est la solution pour découvrir et réserver des activités locales sur Casablanca.
          </p>

          {/* Call to action */}
          <p className="text-2xl font-bold text-foreground text-center lg:text-left">
            Cliquez, Réservez, Scannez !
          </p>

          {/* Let's go button */}
          <Link
            href="/user-type"
            className="bg-custom-orange hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            {"Let's go !"}
          </Link>
        </div>

        {/* Right Column - Video */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="relative w-full max-w-lg h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            <video
              src="/videos/casa-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-custom-orange text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Footer Links */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <span className="text-white/80">© 2025 Cas@Event</span>
              <Link href="/privacy" className="hover:text-white/80 transition-colors">
                Confidentialité
              </Link>
              <Link href="/terms" className="hover:text-white/80 transition-colors">
                Conditions générales
              </Link>
              <Link href="/help" className="hover:text-white/80 transition-colors">
                Aide et Foire aux questions
              </Link>
              <Link href="/contact" className="hover:text-white/80 transition-colors">
                Fonctionnement du site
              </Link>
              <Link href="/partners" className="hover:text-white/80 transition-colors">
                Infos sur l'entreprise
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>  // <== fermeture de la div racine ajoutée ici
  );
}
