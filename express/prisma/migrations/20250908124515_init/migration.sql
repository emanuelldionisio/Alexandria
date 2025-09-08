-- CreateTable
CREATE TABLE "carrinho_disco" (
    "id_usuario" TEXT NOT NULL,
    "id_prod" TEXT NOT NULL,

    PRIMARY KEY ("id_usuario", "id_prod"),
    CONSTRAINT "carrinho_disco_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "carrinho_livro" (
    "id_usuario" TEXT NOT NULL,
    "id_prod" TEXT NOT NULL,

    PRIMARY KEY ("id_usuario", "id_prod"),
    CONSTRAINT "carrinho_livro_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario" ("cod") ON DELETE RESTRICT ON UPDATE CASCADE
);
