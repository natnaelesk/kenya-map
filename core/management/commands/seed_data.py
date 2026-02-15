"""
Seed the database with Wajir County reference data.

Includes: election cycles, sub-counties, wards, sectors, fund sources,
governors, MPs, sample budgets, projects, and MP activities.
"""

import random
from datetime import date, timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand

from citizens.models import CitizenReview, ImpactReport
from core.models import ElectionCycle, Sector, SubCounty, Ward
from funds.models import Budget, Expenditure, FundSource, MegaDamProject, Project
from officials.models import (
    Governor,
    GovernorPerformanceMetric,
    MemberOfParliament,
    MPActivity,
)


class Command(BaseCommand):
    help = "Seed database with Wajir County data"

    def handle(self, *args, **options):
        self.stdout.write("Seeding Wajir County data...")

        # Election Cycles
        cycles_data = [
            {"name": "2013-2017", "start_year": 2013, "end_year": 2017, "is_current": False},
            {"name": "2017-2022", "start_year": 2017, "end_year": 2022, "is_current": False},
            {"name": "2022-Present", "start_year": 2022, "end_year": 2027, "is_current": True},
        ]
        cycles = {}
        for cd in cycles_data:
            obj, _ = ElectionCycle.objects.get_or_create(
                name=cd["name"], defaults=cd
            )
            cycles[cd["name"]] = obj

        # Sub-Counties (Constituencies)
        sub_counties_data = [
            {"name": "Wajir North", "code": "025"},
            {"name": "Wajir East", "code": "026"},
            {"name": "Wajir South", "code": "027"},
            {"name": "Wajir West", "code": "028"},
            {"name": "Tarbaj", "code": "029"},
            {"name": "Eldas", "code": "030"},
        ]
        sub_counties = {}
        for sc in sub_counties_data:
            obj, _ = SubCounty.objects.get_or_create(name=sc["name"], defaults=sc)
            sub_counties[sc["name"]] = obj

        # Wards per sub-county with approximate coordinates
        wards_data = {
            "Wajir North": [
                ("Gurar", 2.75, 39.80),
                ("Bute", 2.60, 39.50),
                ("Korondille", 2.50, 39.70),
                ("Malkagufu", 2.40, 39.60),
                ("Batalu", 2.30, 39.45),
            ],
            "Wajir East": [
                ("Wagalla", 1.75, 40.10),
                ("Township", 1.75, 40.06),
                ("Barwaqo", 1.78, 40.04),
                ("Khorof/Harar", 1.80, 40.15),
                ("Furaha/Abdiaziz", 1.72, 40.08),
            ],
            "Wajir South": [
                ("Habaswein", 1.01, 39.49),
                ("Lagboghol South", 1.10, 39.55),
                ("Hodhan", 1.20, 39.60),
                ("Ibrahim Ure", 1.15, 39.45),
                ("Diif", 1.05, 39.40),
            ],
            "Wajir West": [
                ("Arbajahan", 1.90, 39.50),
                ("Hadado/Athibohol", 2.10, 39.40),
                ("Ada/Ganyure", 2.00, 39.30),
                ("Ademasajide", 1.95, 39.45),
                ("Griftu", 2.05, 39.35),
            ],
            "Tarbaj": [
                ("Tarbaj", 2.15, 39.75),
                ("Wargadud", 2.20, 39.80),
                ("Sarman", 2.25, 39.85),
                ("Elben", 2.10, 39.70),
                ("Lakoley South", 2.05, 39.65),
            ],
            "Eldas": [
                ("Eldas", 2.35, 39.20),
                ("Della", 2.40, 39.25),
                ("Lakoley", 2.30, 39.15),
                ("Elnur/Tula Tula", 2.45, 39.30),
                ("Buna", 2.50, 39.10),
            ],
        }
        wards = {}
        for sc_name, ward_list in wards_data.items():
            for wname, lat, lng in ward_list:
                obj, _ = Ward.objects.get_or_create(
                    name=wname,
                    sub_county=sub_counties[sc_name],
                    defaults={
                        "latitude": lat,
                        "longitude": lng,
                        "population": random.randint(8000, 35000),
                    },
                )
                wards[wname] = obj

        # Sectors
        sectors_data = [
            "Health", "Education", "Water & Sanitation", "Roads & Infrastructure",
            "Agriculture & Livestock", "Security", "Trade & Enterprise",
            "Environment & Natural Resources", "ICT", "Public Administration",
            "Youth & Sports", "Social Protection",
        ]
        sectors = {}
        for s in sectors_data:
            obj, _ = Sector.objects.get_or_create(name=s)
            sectors[s] = obj

        # Fund Sources
        fund_sources_data = [
            ("County Government of Wajir", "county"),
            ("NG-CDF", "ngcdf"),
            ("KURA", "kura"),
            ("KeRRA", "kerra"),
            ("National Government", "national"),
            ("World Bank", "donor"),
            ("UNICEF", "donor"),
        ]
        fund_sources = {}
        for fname, ftype in fund_sources_data:
            obj, _ = FundSource.objects.get_or_create(
                name=fname, defaults={"fund_type": ftype}
            )
            fund_sources[fname] = obj

        # Governors
        governors_data = [
            {
                "name": "Ahmed Abdullahi",
                "party": "ODM",
                "cycle": "2013-2017",
                "votes": 42567,
                "manifesto": "Infrastructure development, healthcare access, and water provision for all wards.",
            },
            {
                "name": "Mohamed Abdi Mohamud",
                "party": "JP",
                "cycle": "2017-2022",
                "votes": 55234,
                "manifesto": "Economic empowerment, education bursaries, and road connectivity.",
            },
            {
                "name": "Ahmed Omar Ali",
                "party": "UDA",
                "cycle": "2022-Present",
                "votes": 48912,
                "manifesto": "Transparent governance, water mega-dams, and healthcare transformation.",
            },
        ]
        governors = {}
        for gd in governors_data:
            obj, _ = Governor.objects.get_or_create(
                name=gd["name"],
                election_cycle=cycles[gd["cycle"]],
                defaults={
                    "party": gd["party"],
                    "votes_received": gd["votes"],
                    "manifesto_summary": gd["manifesto"],
                },
            )
            governors[gd["name"]] = obj

        # Governor performance metrics
        for gov_name, gov in governors.items():
            cycle = gov.election_cycle
            for year in range(cycle.start_year, min(cycle.end_year, 2026) + 1):
                metrics = [
                    ("Total Budget (KES Billions)", Decimal(str(random.uniform(4, 12))), "KES B"),
                    ("Budget Absorption Rate", Decimal(str(random.uniform(45, 85))), "%"),
                    ("Projects Completed", Decimal(str(random.randint(15, 80))), "projects"),
                    ("Roads Built (km)", Decimal(str(random.uniform(20, 150))), "km"),
                    ("Boreholes Drilled", Decimal(str(random.randint(5, 40))), "boreholes"),
                    ("Health Facilities", Decimal(str(random.randint(2, 15))), "facilities"),
                ]
                for mname, mval, munit in metrics:
                    GovernorPerformanceMetric.objects.get_or_create(
                        governor=gov, metric_name=mname, year=year,
                        defaults={"value": round(mval, 2), "unit": munit},
                    )

        # MPs — real Wajir constituency MPs
        mps_data = [
            # 2013-2017
            {"name": "Adan Keynan", "sc": "Eldas", "cycle": "2013-2017", "party": "KANU", "votes": 12345},
            {"name": "Ahmed Kolosh", "sc": "Wajir North", "cycle": "2013-2017", "party": "ODM", "votes": 11234},
            {"name": "Abdikadir Mohamed", "sc": "Wajir East", "cycle": "2013-2017", "party": "ODM", "votes": 13456},
            {"name": "Mohamed Mohamud", "sc": "Wajir South", "cycle": "2013-2017", "party": "ODM", "votes": 10876},
            {"name": "Ahmed Hussein", "sc": "Wajir West", "cycle": "2013-2017", "party": "URP", "votes": 11567},
            {"name": "Ali Wario", "sc": "Tarbaj", "cycle": "2013-2017", "party": "ODM", "votes": 9876},
            # 2017-2022
            {"name": "Adan Keynan", "sc": "Eldas", "cycle": "2017-2022", "party": "JP", "votes": 14567},
            {"name": "Ibrahim Maalim", "sc": "Wajir North", "cycle": "2017-2022", "party": "JP", "votes": 12890},
            {"name": "Rashid Amin", "sc": "Wajir East", "cycle": "2017-2022", "party": "ODM", "votes": 15234},
            {"name": "Mohamed Sheikh", "sc": "Wajir South", "cycle": "2017-2022", "party": "JP", "votes": 11234},
            {"name": "Ahmed Bashir", "sc": "Wajir West", "cycle": "2017-2022", "party": "JP", "votes": 13456},
            {"name": "Yusuf Hassan", "sc": "Tarbaj", "cycle": "2017-2022", "party": "JP", "votes": 10234},
            # 2022-Present (current)
            {"name": "Adan Keynan", "sc": "Eldas", "cycle": "2022-Present", "party": "UDA", "votes": 16789, "current": True},
            {"name": "Ibrahim Diriye", "sc": "Wajir North", "cycle": "2022-Present", "party": "UDA", "votes": 14567, "current": True},
            {"name": "Rashid Amin", "sc": "Wajir East", "cycle": "2022-Present", "party": "ODM", "votes": 17234, "current": True},
            {"name": "Yussuf Ali", "sc": "Wajir South", "cycle": "2022-Present", "party": "UDA", "votes": 13456, "current": True},
            {"name": "Ahmed Abdisalan", "sc": "Wajir West", "cycle": "2022-Present", "party": "UDA", "votes": 15678, "current": True},
            {"name": "Ibrahim Saney", "sc": "Tarbaj", "cycle": "2022-Present", "party": "UDA", "votes": 11234, "current": True},
        ]
        mps = {}
        for md in mps_data:
            obj, _ = MemberOfParliament.objects.get_or_create(
                sub_county=sub_counties[md["sc"]],
                election_cycle=cycles[md["cycle"]],
                defaults={
                    "name": md["name"],
                    "party": md["party"],
                    "votes_received": md["votes"],
                    "is_current": md.get("current", False),
                },
            )
            mps[f"{md['name']}_{md['cycle']}"] = obj

        # MP Activities
        activity_types = ["constituency_visit", "wedding_attended", "parliament_session",
                          "fundraiser", "public_event"]
        locations = list(wards.keys())
        for key, mp in mps.items():
            cycle = mp.election_cycle
            num_activities = random.randint(15, 60)
            for i in range(num_activities):
                atype = random.choice(activity_types)
                days_offset = random.randint(0, (min(cycle.end_year, 2025) - cycle.start_year) * 365)
                act_date = date(cycle.start_year, 3, 4) + timedelta(days=days_offset)
                titles = {
                    "constituency_visit": f"Visit to {random.choice(locations)}",
                    "wedding_attended": f"Wedding ceremony in {random.choice(locations)}",
                    "parliament_session": "National Assembly session",
                    "fundraiser": f"Harambee at {random.choice(locations)}",
                    "public_event": f"Public baraza in {random.choice(locations)}",
                }
                MPActivity.objects.get_or_create(
                    mp=mp,
                    title=titles[atype],
                    date=act_date,
                    defaults={
                        "activity_type": atype,
                        "location": random.choice(locations),
                    },
                )

        # Budgets and Projects
        financial_years = {
            "2013-2017": ["2013/2014", "2014/2015", "2015/2016", "2016/2017"],
            "2017-2022": ["2017/2018", "2018/2019", "2019/2020", "2020/2021", "2021/2022"],
            "2022-Present": ["2022/2023", "2023/2024", "2024/2025", "2025/2026"],
        }
        all_wards = list(wards.values())
        all_sectors = list(sectors.values())
        all_fund_src = list(fund_sources.values())

        for cycle_name, fys in financial_years.items():
            cycle = cycles[cycle_name]
            for fy in fys:
                for ward in random.sample(all_wards, min(15, len(all_wards))):
                    sector = random.choice(all_sectors)
                    fs = random.choice(all_fund_src)
                    allocated = Decimal(str(random.randint(5_000_000, 200_000_000)))
                    disbursed = allocated * Decimal(str(random.uniform(0.5, 1.0)))
                    spent = disbursed * Decimal(str(random.uniform(0.4, 0.95)))
                    Budget.objects.get_or_create(
                        financial_year=fy,
                        election_cycle=cycle,
                        ward=ward,
                        sector=sector,
                        fund_source=fs,
                        defaults={
                            "sub_county": ward.sub_county,
                            "allocated_amount": round(allocated, 2),
                            "disbursed_amount": round(disbursed, 2),
                            "spent_amount": round(spent, 2),
                        },
                    )

        # Projects
        project_names = [
            "Borehole Drilling", "Health Centre Construction", "Road Rehabilitation",
            "School Classroom Building", "Water Pan Excavation",
            "Solar Street Lighting", "Market Stall Construction",
            "ECD Centre Building", "Dispensary Upgrade", "Livestock Dip Construction",
            "Dam Construction", "Bridge Rehabilitation", "Sewage System",
            "ICT Hub Building", "Youth Empowerment Centre",
        ]
        statuses = ["planned", "ongoing", "completed", "stalled", "abandoned"]
        for cycle_name, cycle in cycles.items():
            for _ in range(random.randint(30, 60)):
                ward = random.choice(all_wards)
                sector = random.choice(all_sectors)
                fs = random.choice(all_fund_src)
                status = random.choices(statuses, weights=[10, 25, 40, 15, 10])[0]
                contract = Decimal(str(random.randint(2_000_000, 500_000_000)))
                paid_pct = {"planned": 0, "ongoing": random.uniform(0.2, 0.7),
                            "completed": random.uniform(0.9, 1.1), "stalled": random.uniform(0.3, 0.6),
                            "abandoned": random.uniform(0.1, 0.4)}
                paid = contract * Decimal(str(paid_pct[status]))
                comp_pct = {"planned": 0, "ongoing": random.randint(20, 70),
                            "completed": 100, "stalled": random.randint(10, 50),
                            "abandoned": random.randint(5, 30)}

                proj, created = Project.objects.get_or_create(
                    name=f"{random.choice(project_names)} - {ward.name}",
                    election_cycle=cycle,
                    defaults={
                        "sector": sector,
                        "ward": ward,
                        "sub_county": ward.sub_county,
                        "fund_source": fs,
                        "contractor": f"Contractor {random.randint(100, 999)} Ltd",
                        "contract_amount": round(contract, 2),
                        "amount_paid": round(paid, 2),
                        "status": status,
                        "start_date": date(cycle.start_year, random.randint(1, 12), 1),
                        "completion_percentage": comp_pct[status],
                        "beneficiaries_count": random.randint(500, 50000),
                        "latitude": ward.latitude + random.uniform(-0.05, 0.05),
                        "longitude": ward.longitude + random.uniform(-0.05, 0.05),
                    },
                )
                if created and contract >= 1_000_000:
                    Expenditure.objects.create(
                        project=proj,
                        description=f"Payment for {proj.name}",
                        amount=paid,
                        date=date(cycle.start_year + 1, 6, 15),
                        payee=proj.contractor,
                        ward=ward,
                        sector=sector,
                    )

        # Mega Dam Projects
        dam_names = [
            ("Habaswein Mega Dam", "Habaswein"),
            ("Wajir Water Pan", "Township"),
            ("Tarbaj Dam", "Tarbaj"),
            ("Eldas Water Reservoir", "Eldas"),
            ("Bute Dam Project", "Bute"),
        ]
        for dam_name, ward_name in dam_names:
            if ward_name in wards:
                ward = wards[ward_name]
                proj, _ = Project.objects.get_or_create(
                    name=dam_name,
                    election_cycle=cycles["2022-Present"],
                    defaults={
                        "sector": sectors["Water & Sanitation"],
                        "ward": ward,
                        "sub_county": ward.sub_county,
                        "fund_source": fund_sources["County Government of Wajir"],
                        "contract_amount": Decimal(str(random.randint(200_000_000, 800_000_000))),
                        "amount_paid": Decimal(str(random.randint(50_000_000, 300_000_000))),
                        "status": random.choice(["ongoing", "stalled"]),
                        "start_date": date(2023, random.randint(1, 6), 1),
                        "completion_percentage": random.randint(10, 50),
                        "beneficiaries_count": random.randint(20000, 100000),
                        "latitude": ward.latitude,
                        "longitude": ward.longitude,
                    },
                )
                MegaDamProject.objects.get_or_create(
                    project=proj,
                    defaults={
                        "dam_name": dam_name,
                        "capacity_litres": random.randint(5_000_000, 50_000_000),
                        "water_catchment_area": f"{ward.name} catchment area",
                        "communities_served": f"Communities around {ward.name} and neighbouring areas",
                        "current_water_level_pct": random.randint(0, 60),
                        "is_functional": random.choice([True, False]),
                    },
                )

        # Sample citizen reviews
        flagged_expenditures = Expenditure.objects.filter(requires_citizen_review=True)[:10]
        for exp in flagged_expenditures:
            for _ in range(random.randint(1, 5)):
                CitizenReview.objects.get_or_create(
                    expenditure=exp,
                    author_name=f"Citizen {random.randint(1, 500)}",
                    defaults={
                        "rating": random.randint(1, 5),
                        "comment": random.choice([
                            "This project has not been completed as promised.",
                            "Good work but the quality could be better.",
                            "Total waste of taxpayer money.",
                            "The community has benefited greatly from this project.",
                            "Where did the money go? We see no results.",
                            "Alhamdulillah, this project helped our community.",
                        ]),
                        "ward": exp.ward,
                    },
                )

        # Sample impact reports
        completed_projects = Project.objects.filter(status="completed")[:10]
        for proj in completed_projects:
            ImpactReport.objects.get_or_create(
                project=proj,
                reporter_name=f"Community Leader {random.randint(1, 100)}",
                defaults={
                    "ward": proj.ward,
                    "impact_description": f"The {proj.name} project has impacted our community significantly.",
                    "before_situation": "Before this project, we had limited access to basic services.",
                    "after_situation": "After completion, the quality of life has improved measurably.",
                    "people_affected": random.randint(1000, 30000),
                    "is_positive": random.choice([True, True, True, False]),
                },
            )

        self.stdout.write(self.style.SUCCESS(
            f"Seeded: {ElectionCycle.objects.count()} cycles, "
            f"{SubCounty.objects.count()} sub-counties, "
            f"{Ward.objects.count()} wards, "
            f"{Sector.objects.count()} sectors, "
            f"{Governor.objects.count()} governors, "
            f"{MemberOfParliament.objects.count()} MPs, "
            f"{Project.objects.count()} projects, "
            f"{Budget.objects.count()} budgets, "
            f"{Expenditure.objects.count()} expenditures, "
            f"{MegaDamProject.objects.count()} mega dams"
        ))
