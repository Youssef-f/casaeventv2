"use client";

import Image from "next/image";
import signInImage from "@/public/images/sign-in-image.jpg";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const formSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
});

type FormData = z.infer<typeof formSchema>;

const ADMIN_EMAIL = "admin@casaevent.com";

const Page = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log("Connexion réussie :", userCredential.user);
      if (userCredential.user.email === ADMIN_EMAIL) {
        router.push("/admin-dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("Aucun compte trouvé pour cet email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Mot de passe incorrect.");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
      console.error(err);
    }
  };

  return (
    <div className="bg-white w-full min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Partie gauche : formulaire */}
        <div className="w-1/2 flex flex-col items-center justify-center gap-4 px-8">
          <div className="max-w-md flex flex-col items-center gap-4">
            <h2 className="font-bold text-2xl mt-2">Cas@Event | Connexion</h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 w-full"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Entrer une adresse email"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Entrer votre mot de passe"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                <Button type="submit" className="w-full bg-custom-orange">
                  Connexion
                </Button>
              </form>
            </Form>

            <div className="w-full flex flex-col gap-4 mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">
                    Ou continuer avec
                  </span>
                </div>
              </div>
              <Button className="w-full bg-custom-orange flex items-center justify-center gap-2">
                {/* Icône Google SVG */}
                <svg
                  className="h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="white"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                Continuer avec Google
              </Button>
            </div>

            <p className="text-sm mt-6">
              Vous n'avez pas de compte ?{" "}
              <span className="text-custom-orange font-bold">
                <Link href="/sign-up">Inscrivez-vous ici</Link>
              </span>
            </p>
          </div>
        </div>

        {/* Partie droite : image */}
        <div className="w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div className="max-w-md text-center">
            <h3 className="font-bold text-2xl mb-4">Visiteurs & Touristes</h3>
            <p className="text-slate-400 mb-8">
              Cas@Event est la solution pour découvrir et réserver des activités
              locales sur Casablanca.
            </p>
            <Image
              src={signInImage}
              alt="Image de connexion"
              width={536}
              height={728}
              style={{ height: "auto", width: "auto" }}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>

      <footer className="w-full bg-custom-orange py-2 text-white">
        <ul className="flex justify-center items-center gap-6 text-sm">
          <li>
            <Link href="#" className="text-white hover:underline">
              © 2025 Cas@Event
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:underline">
              Confidentialité
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:underline">
              Conditions générales
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:underline">
              Plan du site
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:underline">
              Fonctionnement du site
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:underline">
              Infos sur l'entreprise
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Page;
