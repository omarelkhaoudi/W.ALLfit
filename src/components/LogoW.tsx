export default function LogoW({ className = "w-6 h-6", fillColor = "currentColor" }: { className?: string; fillColor?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* W stylisé en ruban plié continu */}
      
      {/* Trait vertical gauche (outline) */}
      <path
        d="M 18 22 L 18 78"
        stroke={fillColor}
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Première vallée - ruban plié (passe derrière avec ombre) */}
      <path
        d="M 18 50 Q 32 50 45 50"
        stroke={fillColor}
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      
      {/* Ombre de la première vallée pour l'effet de profondeur */}
      <path
        d="M 22 48 Q 32 48 42 50"
        stroke={fillColor}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
      
      {/* Centre du ruban - partie haute (passe devant) */}
      <path
        d="M 45 50 Q 55 50 60 32 Q 65 50 75 50"
        stroke={fillColor}
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
        opacity="1"
      />
      
      {/* Ombre du centre pour l'effet de profondeur */}
      <path
        d="M 47 48 Q 55 48 60 35 Q 65 48 73 48"
        stroke={fillColor}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.25"
      />
      
      {/* Deuxième vallée - ruban plié (passe derrière avec ombre) */}
      <path
        d="M 75 50 Q 88 50 102 50"
        stroke={fillColor}
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      
      {/* Ombre de la deuxième vallée pour l'effet de profondeur */}
      <path
        d="M 78 48 Q 88 48 98 50"
        stroke={fillColor}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
      
      {/* Trait vertical droit (outline) */}
      <path
        d="M 102 22 L 102 78"
        stroke={fillColor}
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Lignes de connexion supérieures pour créer l'effet de ruban continu */}
      <path
        d="M 18 22 Q 32 22 45 22"
        stroke={fillColor}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
      <path
        d="M 75 22 Q 88 22 102 22"
        stroke={fillColor}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
    </svg>
  );
}
