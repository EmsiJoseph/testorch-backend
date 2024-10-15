"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPlan = void 0;
class TestPlan {
    id;
    name;
    sha;
    url;
    createdAt;
    updatedAt;
    constructor(id, name, sha, url, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.sha = sha;
        this.url = url;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.TestPlan = TestPlan;
//# sourceMappingURL=test-plan.entity.js.map