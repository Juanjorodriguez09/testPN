import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from '../skill/entities/skill.entity';
import { Repository } from 'typeorm';
import { skillsData } from './data/skills-data';

@Injectable()
export class SeedService {
  
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async runSeed() {

    await this.insertNewSkills();

    return {
      message: 'SEED EXECUTED',
      skillsInserted: skillsData.length,
    };
  }

  /**
   * Inserta las habilidades en la base de datos
   */
  private async insertNewSkills(): Promise<void> {
    await this.skillRepository.clear();
    await this.skillRepository.insert(skillsData);
  }

}
