class NegociacaoService {

    constructor() {
        this._http = new HTTPService();
    }

    obterNegociacoes() {
        return Promise.all([
            this.obterNegociacoesDaSemana(),
            this.obterNegociacoesDaSemanaAnterior(),
            this.obterNegociacoesDaSemanaRetrasada()]
        ).then(periodos => {
            let negociacoes = periodos
            .reduce((dados, periodo) => dados.concat(periodo), []);

            return negociacoes;
        }).catch(erro => {
            throw new Error(erro)
        });
    }

    async obterNegociacoesDaSemana() {
        return this._http.get('negociacoes/semana')
        .then(negociacoes => 
            negociacoes.map(o => new Negociacao(new Date(o.data), o.quantidade, o.valor))
        ).catch(erro => {
            console.log(erro);
            throw new Error('Não foi possível obter as negociações da semana');
        });

    }

    async obterNegociacoesDaSemanaAnterior() {
        try {
            const negociacoes = await this._http.get('negociacoes/anterior');
            return negociacoes.map(o => new Negociacao(new Date(o.data), o.quantidade, o.valor));
        }
        catch (erro) {
            console.log(erro);
            throw new Error('Não foi possível obter as negociações da semana anterior');
        }
    }

    async obterNegociacoesDaSemanaRetrasada() {
        return this._http.get('negociacoes/retrasada')
        .then(negociacoes => 
                negociacoes.map(o => new Negociacao(new Date(o.data), o.quantidade, o.valor))
        ).catch(erro => {
            console.log(erro);
            throw new Error('Não foi possível obter as negociações da semana retrasada');
        });
    }
}