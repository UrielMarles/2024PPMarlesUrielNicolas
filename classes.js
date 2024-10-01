export class Vehiculo {
    constructor(id, modelo, anoFab, velMax) {
        if (id <= 0) {
            throw new Error('El ID debe ser mayor a 0.');
        }
        if (!modelo || modelo.trim() === "") {
            throw new Error('El modelo no puede estar vacío.');
        }
        if (anoFab <= 1885) {
            throw new Error('El año de fabricación debe ser mayor a 1885.');
        }
        if (velMax <= 0) {
            throw new Error('La velocidad máxima debe ser mayor a 0.');
        }
        
        this.id = id;
        this.modelo = modelo;
        this.anoFab = anoFab;
        this.velMax = velMax;
    }

    toString() {
        return `${this.modelo} (${this.anoFab}) - Velocidad máxima: ${this.velMax} km/h`;
    }
}

export class Aereo extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, altMax, autonomia) {
        super(id, modelo, anoFab, velMax);
        if (altMax <= 0) {
            throw new Error('La altitud máxima debe ser mayor a 0.');
        }
        if (autonomia <= 0) {
            throw new Error('La autonomía debe ser mayor a 0.');
        }

        this.altMax = altMax;
        this.autonomia = autonomia;
    }

    toString() {
        return `${super.toString()} - Altitud máxima: ${this.altMax} m - Autonomía: ${this.autonomia} km`;
    }
}

export class Terrestre extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, cantPue, cantRue) {
        super(id, modelo, anoFab, velMax);
        if (cantPue <= -1) {
            throw new Error('La cantidad de puertas debe ser mayor a -1.');
        }
        if (cantRue <= 0) {
            throw new Error('La cantidad de ruedas debe ser mayor a 0.');
        }   

        this.cantPue = cantPue;
        this.cantRue = cantRue;
    }

    toString() {
        return `${super.toString()} - Puertas: ${this.cantPue} - Ruedas: ${this.cantRue}`;
    }
}
