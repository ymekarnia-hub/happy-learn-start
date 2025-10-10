import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Eye, EyeOff, User } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import iconStudent from "@/assets/icon-student.png";
import iconParent from "@/assets/icon-parent.png";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileType, setProfileType] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session) {
          setTimeout(() => {
            navigate("/");
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success("Connexion réussie !");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              first_name: firstName,
              last_name: lastName,
              full_name: `${firstName} ${lastName}`,
              profile_type: profileType,
              class_level: classLevel,
            },
          },
        });

        if (error) throw error;
        toast.success("Compte créé ! Vérifiez votre email.");
      }
    } catch (error: any) {
      if (error.message.includes("Email not confirmed")) {
        toast.error("Veuillez confirmer votre email avant de vous connecter.");
      } else if (error.message.includes("Invalid login credentials")) {
        toast.error("Email ou mot de passe incorrect.");
      } else if (error.message.includes("User already registered")) {
        toast.error("Un compte existe déjà avec cet email.");
      } else {
        toast.error(error.message || "Une erreur s'est produite.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: "google" | "facebook" | "apple") => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la connexion sociale.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      });

      if (error) throw error;
      toast.success("Email de réinitialisation envoyé !");
      setShowForgotPassword(false);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'envoi de l'email.");
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    return null;
  }

  return (
    <>
      <Header minimal={true} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4 pt-24">
      <div className="w-full max-w-2xl">
        <div className="bg-card rounded-2xl shadow-[var(--shadow-elegant)] p-8 border border-border">
          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-foreground mb-8">
            {showForgotPassword ? "Mot de passe oublié" : isLogin ? "Connecte-toi !" : "Inscription"}
          </h1>

          {showForgotPassword ? (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <Input
                type="email"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/20 border-border"
                required
              />

              <Button type="submit" className="w-full bg-primary" disabled={loading}>
                {loading ? "Envoi..." : "Réinitialiser le mot de passe"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setShowForgotPassword(false)}
              >
                Retour à la connexion
              </Button>
            </form>
          ) : (
            <>
              {!isLogin && (
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {/* Social Login Buttons */}
                  <div className="space-y-3 mb-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialAuth("google")}
                      disabled={loading}
                      className="w-full justify-start"
                    >
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC04"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#4285F4"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continuer avec Google
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialAuth("facebook")}
                      disabled={loading}
                      className="w-full justify-start"
                    >
                      <svg className="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Continuer avec Facebook
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                      <span className="bg-card px-3 text-muted-foreground">OU</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                      <Input
                        type="text"
                        placeholder="Prénom"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-secondary/20 border-2 border-red-500 pl-10"
                        required
                      />
                    </div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                      <Input
                        type="text"
                        placeholder="Nom"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-secondary/20 border-2 border-red-500 pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Input
                    type="email"
                    placeholder="Adresse e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary/20 border-border"
                    required
                  />
                  
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-secondary/20 border-border pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Type de profil</Label>
                    <RadioGroup value={profileType} onValueChange={setProfileType} required>
                      <div className="grid grid-cols-2 gap-4">
                        <Label 
                          htmlFor="enfant" 
                          className={cn(
                            "flex flex-col items-center justify-center h-32 px-4 rounded-lg border-2 cursor-pointer transition-all",
                            profileType === "enfant" 
                              ? "bg-primary text-primary-foreground border-primary shadow-lg" 
                              : "bg-secondary/20 border-red-500 hover:bg-secondary/30"
                          )}
                        >
                          <RadioGroupItem value="enfant" id="enfant" className="sr-only" />
                          <img src={iconStudent} alt="Élève" className="h-20 w-20 mb-2 object-contain" />
                          <span className="font-semibold">Élève</span>
                        </Label>
                        <Label 
                          htmlFor="parent" 
                          className={cn(
                            "flex flex-col items-center justify-center h-32 px-4 rounded-lg border-2 cursor-pointer transition-all",
                            profileType === "parent" 
                              ? "bg-primary text-primary-foreground border-primary shadow-lg" 
                              : "bg-secondary/20 border-red-500 hover:bg-secondary/30"
                          )}
                        >
                          <RadioGroupItem value="parent" id="parent" className="sr-only" />
                          <img src={iconParent} alt="Parent" className="h-20 w-20 mb-2 object-contain" />
                          <span className="font-semibold">Parent</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Classe</Label>
                    <RadioGroup value={classLevel} onValueChange={setClassLevel} required>
                      <div className="grid grid-cols-2 gap-3">
                        <Label 
                          htmlFor="6eme" 
                          className={cn(
                            "flex items-center justify-center h-10 px-4 rounded-md border-2 cursor-pointer transition-all font-medium",
                            classLevel === "6eme" 
                              ? "bg-primary text-primary-foreground border-primary shadow-md" 
                              : "bg-secondary/20 border-border hover:bg-secondary/30 hover:border-primary"
                          )}
                        >
                          <RadioGroupItem value="6eme" id="6eme" className="sr-only" />
                          6ème
                        </Label>
                        <Label 
                          htmlFor="7eme" 
                          className={cn(
                            "flex items-center justify-center h-10 px-4 rounded-md border-2 cursor-pointer transition-all font-medium",
                            classLevel === "7eme" 
                              ? "bg-primary text-primary-foreground border-primary shadow-md" 
                              : "bg-secondary/20 border-border hover:bg-secondary/30 hover:border-primary"
                          )}
                        >
                          <RadioGroupItem value="7eme" id="7eme" className="sr-only" />
                          7ème
                        </Label>
                        <Label 
                          htmlFor="8eme" 
                          className={cn(
                            "flex items-center justify-center h-10 px-4 rounded-md border-2 cursor-pointer transition-all font-medium",
                            classLevel === "8eme" 
                              ? "bg-primary text-primary-foreground border-primary shadow-md" 
                              : "bg-secondary/20 border-border hover:bg-secondary/30 hover:border-primary"
                          )}
                        >
                          <RadioGroupItem value="8eme" id="8eme" className="sr-only" />
                          8ème
                        </Label>
                        <Label 
                          htmlFor="9eme" 
                          className={cn(
                            "flex items-center justify-center h-10 px-4 rounded-md border-2 cursor-pointer transition-all font-medium",
                            classLevel === "9eme" 
                              ? "bg-primary text-primary-foreground border-primary shadow-md" 
                              : "bg-secondary/20 border-border hover:bg-secondary/30 hover:border-primary"
                          )}
                        >
                          <RadioGroupItem value="9eme" id="9eme" className="sr-only" />
                          9ème
                        </Label>
                        <Label 
                          htmlFor="seconde" 
                          className={cn(
                            "flex items-center justify-center h-10 px-4 rounded-md border-2 cursor-pointer transition-all font-medium",
                            classLevel === "seconde" 
                              ? "bg-primary text-primary-foreground border-primary shadow-md" 
                              : "bg-yellow-50 border-yellow-400 hover:bg-yellow-100 hover:border-yellow-500"
                          )}
                        >
                          <RadioGroupItem value="seconde" id="seconde" className="sr-only" />
                          Seconde
                        </Label>
                        <Label 
                          htmlFor="premiere" 
                          className={cn(
                            "flex items-center justify-center h-10 px-4 rounded-md border-2 cursor-pointer transition-all font-medium",
                            classLevel === "premiere" 
                              ? "bg-primary text-primary-foreground border-primary shadow-md" 
                              : "bg-yellow-50 border-yellow-400 hover:bg-yellow-100 hover:border-yellow-500"
                          )}
                        >
                          <RadioGroupItem value="premiere" id="premiere" className="sr-only" />
                          1ère
                        </Label>
                        <Label 
                          htmlFor="terminale" 
                          className={cn(
                            "flex items-center justify-center h-10 px-4 rounded-md border-2 cursor-pointer transition-all font-medium",
                            classLevel === "terminale" 
                              ? "bg-primary text-primary-foreground border-primary shadow-md" 
                              : "bg-yellow-50 border-yellow-400 hover:bg-yellow-100 hover:border-yellow-500"
                          )}
                        >
                          <RadioGroupItem value="terminale" id="terminale" className="sr-only" />
                          Terminale
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button type="submit" className="w-full bg-primary" disabled={loading}>
                    {loading ? "Chargement..." : "S'inscrire"}
                  </Button>
                </form>
              )}

              {isLogin && (
                <>
                  {/* Social Login Buttons */}
                  <div className="space-y-3 mb-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialAuth("google")}
                      disabled={loading}
                      className="w-full justify-start"
                    >
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC04"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#4285F4"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Se connecter avec Google
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialAuth("facebook")}
                      disabled={loading}
                      className="w-full justify-start"
                    >
                      <svg className="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Se connecter avec Facebook
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialAuth("apple")}
                      disabled={loading}
                      className="w-full justify-start"
                    >
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                      Se connecter avec Apple
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                      <span className="bg-card px-3 text-muted-foreground">OU</span>
                    </div>
                  </div>

                  {/* Email/Password Form */}
                  <form onSubmit={handleEmailAuth} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Adresse e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-secondary/20 border-border"
                      required
                    />

                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-secondary/20 border-border pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        />
                        <label
                          htmlFor="remember"
                          className="text-sm text-foreground cursor-pointer"
                        >
                          Se souvenir de moi
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-primary hover:underline"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>

                    <Button type="submit" className="w-full bg-primary" disabled={loading}>
                      {loading ? "Chargement..." : "Se connecter"}
                    </Button>
                  </form>
                </>
              )}

              {/* Toggle Login/Signup */}
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-foreground"
                >
                  {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
                  <span className="text-primary hover:underline font-medium">
                    {isLogin ? "Inscris-toi" : "Connecte-toi"}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Auth;
