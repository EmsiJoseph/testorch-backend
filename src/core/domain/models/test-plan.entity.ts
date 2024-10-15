export class TestPlan {
    constructor(
        public id: string,
        public name: string,
        public sha: string,
        public url: string,
        public createdAt: Date, 
        public updatedAt: Date, 
    ) {}
}