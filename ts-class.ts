class Robot {
  constructor(name: string, os: string, year: number) {
    this.name = name;
    this.os = os;
    this.year = year;
    this.sn = Math.random() * 10;
    this._chip = 'N/A';
  }

  print() {
    console.log(`Robot: ${this.name}-${this.year} run on ${this.os}.`);
  }

  set chip(value: string) {
    if (value != '') this._chip = value;
    else this._chip = 'NOT INSTALLED'
  }

  get chip() {
    return `[${this._chip}]`;
  }

  private name: string;
  private os: string;
  private year: number; 
  private _chip: string;
  private readonly sn:number;
}

function main(): number {
  let r1 = new Robot('z1ff', 'linux(zorin)', 2018);
  let r2 = new Robot('z2ff', 'linux(ubuntu)', 2022);

  r1.print();
  r2.print();

  console.log(r1.chip);
  r1.chip = 'arduio';
  r2.chip = '';
  console.log(r1.chip);
  console.log(r2.chip);
  return 0;
}

main()
