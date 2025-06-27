"use client";

import {Suspense} from "react";
import ValidateExpenseContent from "./validateExpenseContent";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando validação...</div>}>
      <ValidateExpenseContent />
    </Suspense>
  );
}
