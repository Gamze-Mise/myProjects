import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// API'de kullanılan tip
export interface Award {
  award_id?: number;
  user_id: number;
  subject: string;
  company?: string;
  date?: Date;
  lang?: string;
}

// Tip dönüşüm fonksiyonları - any yerine Prisma.Award kullanıyoruz
const prismaToAward = (prismaAward: any): Award => ({
  award_id: prismaAward.award_id,
  user_id: prismaAward.userId,
  subject: prismaAward.subject,
  company: prismaAward.company || undefined,
  date: prismaAward.date || undefined,
  lang: prismaAward.lang || undefined,
});

export class AwardModel {
  async findAll(user_id: number): Promise<Award[]> {
    const awards = await prisma.award.findMany({
      where: {
        userId: user_id,
      },
    });
    return awards.map(prismaToAward);
  }

  async findById(id: number): Promise<Award | null> {
    const award = await prisma.award.findUnique({
      where: {
        award_id: id,
      },
    });
    return award ? prismaToAward(award) : null;
  }

  async create(award: Omit<Award, "award_id">): Promise<Award> {
    // Tarih dönüşümü için yardımcı fonksiyon
    const formatDate = (date: string | Date | undefined) => {
      if (!date) return null;
      return new Date(date).toISOString();
    };

    const created = await prisma.award.create({
      data: {
        userId: award.user_id,
        subject: award.subject,
        company: award.company || null,
        date: award.date ? formatDate(award.date) : null,
        lang: award.lang || null,
      },
    });
    return prismaToAward(created);
  }

  async update(id: number, award: Partial<Award>): Promise<boolean> {
    try {
      await prisma.award.update({
        where: {
          award_id: id,
        },
        data: {
          userId: award.user_id,
          subject: award.subject,
          company: award.company || null,
          date: award.date || null,
          lang: award.lang || null,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.award.delete({
        where: {
          award_id: id,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async countByUserId(user_id: number): Promise<number> {
    return await prisma.award.count({
      where: {
        userId: user_id,
      },
    });
  }
}

export const awardModel = new AwardModel();
