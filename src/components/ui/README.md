# 📦 Composants UI - W.ALLfit

Bibliothèque de composants UI réutilisables pour l'application W.ALLfit.

## 🎨 Composants Disponibles

### Button
Bouton réutilisable avec variants et états.

```tsx
import { Button } from "@/components/ui";

<Button variant="primary" size="md" isLoading={false}>
  Cliquez-moi
</Button>
```

**Props:**
- `variant`: `"primary" | "secondary" | "danger" | "ghost"`
- `size`: `"sm" | "md" | "lg"`
- `isLoading`: `boolean`
- `fullWidth`: `boolean`

### Input
Champ de saisie avec label et gestion d'erreurs.

```tsx
import { Input } from "@/components/ui";

<Input
  label="Email"
  type="email"
  placeholder="votre@email.com"
  error={errors.email}
  icon={<Mail className="w-5 h-5" />}
/>
```

### Card
Carte avec header, content et footer.

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui";

<Card hover>
  <CardHeader>
    <CardTitle>Titre de la carte</CardTitle>
  </CardHeader>
  <CardContent>
    Contenu de la carte
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Badge
Badge pour afficher des labels.

```tsx
import { Badge } from "@/components/ui";

<Badge variant="success" size="md">
  Actif
</Badge>
```

**Variants:** `default`, `success`, `warning`, `danger`, `info`

### Tooltip
Infobulle au survol.

```tsx
import { Tooltip } from "@/components/ui";

<Tooltip content="Information supplémentaire" position="top">
  <button>Survolez-moi</button>
</Tooltip>
```

### Avatar
Avatar utilisateur avec fallback.

```tsx
import { Avatar } from "@/components/ui";

<Avatar
  src="/avatar.jpg"
  alt="John Doe"
  name="John Doe"
  size="lg"
/>
```

### Alert
Message d'alerte avec variants.

```tsx
import { Alert } from "@/components/ui";

<Alert variant="success" title="Succès" onClose={() => setShow(false)}>
  Opération réussie !
</Alert>
```

**Variants:** `default`, `success`, `warning`, `error`, `info`

### Divider
Séparateur horizontal ou vertical.

```tsx
import { Divider } from "@/components/ui";

<Divider text="OU" />
<Divider orientation="vertical" />
```

### Spinner
Indicateur de chargement.

```tsx
import { Spinner } from "@/components/ui";

<Spinner size="lg" text="Chargement..." />
```

### Progress
Barre de progression.

```tsx
import { Progress } from "@/components/ui";

<Progress
  value={75}
  max={100}
  label="Progression"
  showValue
  variant="success"
/>
```

### Modal
Modal accessible avec focus trap.

```tsx
import { Modal } from "@/components/ui";

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Titre du modal"
  footer={<Button>Fermer</Button>}
>
  Contenu du modal
</Modal>
```

### Loading
Écran de chargement complet.

```tsx
import { Loading } from "@/components/ui";

<Loading message="Chargement en cours..." />
```

### Skeleton
Skeleton loaders pour les états de chargement.

```tsx
import { Skeleton, SkeletonCard, SkeletonList } from "@/components/ui";

<Skeleton className="w-full h-20" />
<SkeletonCard />
<SkeletonList count={5} />
```

## 🎯 Utilisation

### Import Groupé

```tsx
import { Button, Card, Badge, Alert } from "@/components/ui";
```

### Import Individuel

```tsx
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
```

## 🎨 Style

Tous les composants suivent le design system minimaliste de W.ALLfit :
- Couleurs : Gris/Noir/Blanc (mode sombre)
- Border-radius : `rounded-2xl` (cohérent)
- Typography : Font-extrabold, uppercase, tracking-wide
- Shadows : `shadow-xl`, `shadow-2xl`
- Transitions : Smooth transitions avec `hover:scale-105`

## ♿ Accessibilité

Tous les composants incluent :
- ARIA labels appropriés
- Support clavier complet
- Focus states visibles
- Rôles sémantiques

## 📝 Exemples Complets

### Exemple 1 : Card avec Badge

```tsx
import { Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";

<Card hover>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Entraînement</CardTitle>
      <Badge variant="success">Complété</Badge>
    </div>
  </CardHeader>
  <CardContent>
    <p>Cardio - 45 min - 320 cal</p>
  </CardContent>
</Card>
```

### Exemple 2 : Formulaire avec Validation

```tsx
import { Input, Button, Alert } from "@/components/ui";

const [errors, setErrors] = useState({});

<form>
  <Input
    label="Email"
    type="email"
    error={errors.email}
  />
  {errors.general && (
    <Alert variant="error">{errors.general}</Alert>
  )}
  <Button type="submit" fullWidth>
    Envoyer
  </Button>
</form>
```

### Exemple 3 : Avatar avec Tooltip

```tsx
import { Avatar, Tooltip } from "@/components/ui";

<Tooltip content="John Doe - Administrateur">
  <Avatar
    src="/avatar.jpg"
    name="John Doe"
    size="md"
  />
</Tooltip>
```

## 🆕 Nouveaux Composants

### Select
Composant de sélection avec dropdown personnalisable.

```tsx
import { Select } from "@/components/ui";

<Select
  label="Type d'entraînement"
  options={[
    { value: "cardio", label: "Cardio" },
    { value: "strength", label: "Musculation" },
  ]}
  value={selectedType}
  onChange={setSelectedType}
  placeholder="Choisir un type"
/>
```

**Props:**
- `label?: string` - Label du select
- `options: SelectOption[]` - Liste des options
- `value?: string` - Valeur sélectionnée
- `onChange?: (value: string) => void` - Callback de changement
- `placeholder?: string` - Texte par défaut
- `error?: string` - Message d'erreur
- `disabled?: boolean` - Désactiver le select
- `icon?: ReactNode` - Icône optionnelle

---

### Tabs
Système d'onglets avec plusieurs variantes.

```tsx
import { Tabs } from "@/components/ui";

<Tabs
  tabs={[
    { id: "stats", label: "Statistiques", content: <StatsContent /> },
    { id: "history", label: "Historique", content: <HistoryContent /> },
  ]}
  variant="pills"
/>
```

**Props:**
- `tabs: Tab[]` - Liste des onglets
- `defaultTab?: string` - Onglet actif par défaut
- `onChange?: (tabId: string) => void` - Callback de changement
- `variant?: "default" | "pills" | "underline"` - Style des onglets

---

### Accordion
Composant accordéon pour afficher/masquer du contenu.

```tsx
import { Accordion } from "@/components/ui";

<Accordion
  items={[
    {
      id: "faq1",
      title: "Comment ajouter un entraînement ?",
      content: "Utilisez le bouton + sur le dashboard",
    },
  ]}
  allowMultiple
/>
```

**Props:**
- `items: AccordionItem[]` - Liste des éléments
- `allowMultiple?: boolean` - Permettre plusieurs éléments ouverts
- `variant?: "default" | "bordered"` - Style de l'accordion

---

### Dropdown
Menu déroulant avec actions.

```tsx
import { Dropdown } from "@/components/ui";
import { Edit, Trash } from "lucide-react";

<Dropdown
  items={[
    {
      id: "edit",
      label: "Modifier",
      icon: <Edit />,
      onClick: () => handleEdit(),
    },
    {
      id: "delete",
      label: "Supprimer",
      icon: <Trash />,
      variant: "danger",
      onClick: () => handleDelete(),
    },
  ]}
  align="right"
/>
```

**Props:**
- `items: DropdownItem[]` - Liste des actions
- `trigger?: ReactNode` - Bouton personnalisé
- `align?: "left" | "right"` - Alignement du menu
- `className?: string` - Classes CSS additionnelles

---

## 🔄 Mises à Jour Futures

- [x] Dropdown Menu ✅
- [x] Tabs ✅
- [x] Accordion ✅
- [x] Select ✅
- [ ] Toast custom (amélioration de react-toastify)
- [ ] Checkbox
- [ ] Radio
- [ ] Switch
- [ ] DatePicker
- [ ] Table
- [ ] Pagination

