-- CreateTable
CREATE TABLE "desejos_disco" (
    "id_usuario" TEXT NOT NULL,
    "id_prod" TEXT NOT NULL,

    PRIMARY KEY ("id_usuario", "id_prod"),
    CONSTRAINT "desejos_disco_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "desejos_livro" (
    "id_usuario" TEXT NOT NULL,
    "id_prod" TEXT NOT NULL,

    PRIMARY KEY ("id_usuario", "id_prod"),
    CONSTRAINT "desejos_livro_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
);
