CREATE TABLE fabricantes (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  nome   VARCHAR(80) NOT NULL,
  UNIQUE KEY uk_fabricante_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE motores (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  codigo         VARCHAR(30)   NOT NULL,
  modelo         VARCHAR(80)   NOT NULL,
  fabricante_id  INT           NOT NULL,
  potencia_cv    DECIMAL(8,2)  NOT NULL,
  tensao         VARCHAR(30)   NOT NULL,
  frequencia_hz  SMALLINT      NOT NULL,
  polos          TINYINT       NOT NULL,
  rotacao_rpm    INT           NOT NULL,
  carcaca        VARCHAR(20)   NULL,
  grau_protecao  VARCHAR(10)   NULL,
  preco          DECIMAL(12,2) NULL,
  criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_motor_codigo (codigo),
  CONSTRAINT fk_motor_fabricante
    FOREIGN KEY (fabricante_id) REFERENCES fabricantes (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;