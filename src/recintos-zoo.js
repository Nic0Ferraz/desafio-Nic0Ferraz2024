class RecintosZoo {
  constructor() {
    this.recintos = [
      { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'macaco', quantidade: 3 }] },
      { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
      { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'gazela', quantidade: 1 }] },
      { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
      { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'leao', quantidade: 1 }] }
    ];

    this.animais = {
      'LEAO': { tamanho: 3, bioma: ['savana'] },
      'LEOPARDO': { tamanho: 2, bioma: ['savana'] },
      'CROCODILO': { tamanho: 3, bioma: ['rio'] },
      'MACACO': { tamanho: 1, bioma: ['savana', 'floresta'] },
      'GAZELA': { tamanho: 2, bioma: ['savana'] },
      'HIPOPOTAMO': { tamanho: 4, bioma: ['savana', 'rio'] }
    };
  }

  analisaRecintos(animal, quantidade) {

    if (!this.animais[animal.toUpperCase()]) {
      return { erro: "Animal inválido" };
    }
    if (typeof quantidade !== 'number' || quantidade <= 0) {
      return { erro: "Quantidade inválida" };
    }

    const animalInfo = this.animais[animal.toUpperCase()];
    const biomasValidos = animalInfo.bioma;
    const tamanhoNecessario = animalInfo.tamanho * quantidade;
    
    
    let recintosViaveis = this.recintos.filter(recinto => 
      biomasValidos.includes(recinto.bioma) &&
      (recinto.tamanho - this.calcularEspacoOcupado(recinto.animais)) >= tamanhoNecessario
    );

    recintosViaveis = recintosViaveis.filter(recinto => this.verificarConforto(animal, recinto, quantidade));

    if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável" };
    }

    recintosViaveis = recintosViaveis.map(recinto => {
      const espacoOcupado = this.calcularEspacoOcupado(recinto.animais);
      const espacoLivre = recinto.tamanho - espacoOcupado - tamanhoNecessario;
      return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`;
    });

    return { recintosViaveis: recintosViaveis.sort() };
  }

  calcularEspacoOcupado(animais) {
    return animais.reduce((total, animal) => total + (this.animais[animal.especie.toUpperCase()].tamanho * animal.quantidade), 0);
  }

  verificarConforto(animal, recinto, quantidade) {
    const animalInfo = this.animais[animal.toUpperCase()];
    const animaisExistentes = recinto.animais;

    if (animalInfo.bioma.length === 1) {
      if (animal === 'MACACO' && quantidade > 1 && animaisExistentes.length === 0) {
        return false;
      }
      
      if (animal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio') {
        return false;
      }
      
      for (const existente of animaisExistentes) {
        const existenteInfo = this.animais[existente.especie.toUpperCase()];
        if (animalInfo.bioma[0] !== existenteInfo.bioma[0]) {
          return false;
        }
        if (animalInfo.tamanho > 1 && existenteInfo.tamanho > 1 && animal !== existente.especie) {
          return false;
        }
      }
    } else {
      if (animal === 'HIPOPOTAMO' && quantidade > 1) {
        return false;
      }
    }
    
    if (animaisExistentes.length > 0 && quantidade > 1) {
      return true;
    }
    
    return true;
  }
}

export { RecintosZoo as RecintosZoo };
